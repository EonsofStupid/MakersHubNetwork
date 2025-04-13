import { create } from 'zustand';
import { authBridge } from '@/auth/bridge';
import { UserProfile, AuthStatus, LogCategory, ROLES, UserRole, RBAC } from '@/shared/types/shared.types';
import { logger } from '@/logging';

// Define the authentication state
export interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  roles: UserRole[];
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  
  // Session management
  initialize: () => Promise<void>;
  refreshSession: () => Promise<void>;
  
  // Authentication methods
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // User profile methods
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  
  // Role management
  hasRole: (allowedRoles: UserRole | UserRole[]) => boolean;
  setRoles: (roles: UserRole[]) => void;
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  
  // Error handling
  clearError: () => void;
}

// Helper function to check if user has required roles
const hasRole = (userRoles: UserRole[], allowedRoles: UserRole | UserRole[]): boolean => {
  // Super admin has all roles
  if (userRoles.includes(ROLES.SUPERADMIN)) {
    return true;
  }
  
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return rolesToCheck.some(role => userRoles.includes(role));
};

// Create the authentication store
export const useAuthStore = create<AuthState>((set, get) => ({
  status: AuthStatus.IDLE,
  user: null,
  roles: [],
  isAuthenticated: false,
  error: null,
  isLoading: false,

  // Initialize auth state
  initialize: async () => {
    set({ isLoading: true, status: AuthStatus.LOADING });
    try {
      const user = await authBridge.getCurrentUser();
      
      if (user) {
        // Set user data in store
        set({
          user,
          isAuthenticated: true,
          status: AuthStatus.AUTHENTICATED,
          roles: user?.roles || [],
          isLoading: false
        });
        
        logger.info('User authenticated', LogCategory.AUTH, { details: { userId: user?.id } });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          status: AuthStatus.UNAUTHENTICATED,
          roles: [],
          isLoading: false
        });
        
        logger.info('No authenticated user', LogCategory.AUTH);
      }
    } catch (error) {
      logger.error('Authentication error', LogCategory.AUTH, { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
      set({
        user: null,
        isAuthenticated: false,
        status: AuthStatus.ERROR,
        roles: [],
        error: error instanceof Error ? error.message : 'Authentication error',
        isLoading: false
      });
    }
  },

  // Refresh session
  refreshSession: async () => {
    try {
      const user = await authBridge.refreshSession();
      
      if (user) {
        set({
          user,
          isAuthenticated: true,
          status: AuthStatus.AUTHENTICATED,
          roles: user?.roles || [],
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          status: AuthStatus.UNAUTHENTICATED,
          roles: [],
        });
      }
    } catch (error) {
      logger.error('Session refresh error', LogCategory.AUTH, { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
      set({
        error: error instanceof Error ? error.message : 'Session refresh error'
      });
    }
  },

  // Check if user has a role
  hasRole: (allowedRoles) => {
    const { roles } = get();
    return hasRole(roles, allowedRoles);
  },

  // Set user roles
  setRoles: (roles) => {
    set({ roles });
  },

  // Sign in with provider
  signIn: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authBridge.signIn(provider);
      if (user) {
        set({
          user,
          isAuthenticated: true,
          status: AuthStatus.AUTHENTICATED,
          roles: user?.roles || [],
          isLoading: false
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          status: AuthStatus.UNAUTHENTICATED,
          roles: [],
          isLoading: false
        });
      }
    } catch (error) {
      logger.error('Sign in error', LogCategory.AUTH, { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
      set({
        error: error instanceof Error ? error.message : 'Sign in failed',
        isLoading: false,
        status: AuthStatus.ERROR
      });
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    set({ isLoading: true });
    try {
      await authBridge.signOut();
      set({
        user: null,
        isAuthenticated: false,
        status: AuthStatus.UNAUTHENTICATED,
        roles: [],
        isLoading: false
      });
      logger.info('User signed out', LogCategory.AUTH);
    } catch (error) {
      logger.error('Sign out error', LogCategory.AUTH, { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
      set({
        error: error instanceof Error ? error.message : 'Sign out failed',
        isLoading: false
      });
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    const { user } = get();
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    set({ isLoading: true });
    
    try {
      const updatedProfile = await authBridge.updateUserProfile({
        id: user.id,
        ...profileData
      });
      
      set({
        user: updatedProfile,
        isLoading: false
      });
      
      return;
    } catch (error) {
      logger.error('Profile update error', LogCategory.AUTH, { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
      set({
        error: error instanceof Error ? error.message : 'Profile update failed',
        isLoading: false
      });
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email) => {
    set({ isLoading: true });
    try {
      await authBridge.resetPassword(email);
      set({ isLoading: false });
      logger.info('Password reset requested', LogCategory.AUTH);
    } catch (error) {
      logger.error('Password reset error', LogCategory.AUTH, { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
      set({
        error: error instanceof Error ? error.message : 'Password reset failed',
        isLoading: false
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
})); 