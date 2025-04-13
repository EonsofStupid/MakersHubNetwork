import { create } from 'zustand';
import { authBridge } from '../bridge';
import { UserProfile, AuthStatus, UserRoleEnum } from '@/shared/types/shared.types';
import { logger } from '@/logging';

// Define the authentication state
export interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  roles: UserRoleEnum[];
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  
  // Session management
  initialize: () => Promise<void>;
  refreshSession: () => Promise<void>;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  
  // User profile methods
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  
  // Role management
  hasRole: (role: UserRoleEnum | UserRoleEnum[]) => boolean;
  setRoles: (roles: UserRoleEnum[]) => void;
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  
  // Error handling
  clearError: () => void;
}

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
      const session = await authBridge.getCurrentSession();
      
      if (session) {
        const user = await authBridge.getUserProfile();
        
        // Set user data in store
        set({
          user,
          isAuthenticated: true,
          status: AuthStatus.AUTHENTICATED,
          roles: user?.roles?.map(role => role as unknown as UserRoleEnum) || [],
          isLoading: false
        });
        
        logger.info('User authenticated', { category: 'auth', user: user?.id });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          status: AuthStatus.UNAUTHENTICATED,
          roles: [],
          isLoading: false
        });
        
        logger.info('No authenticated user');
      }
    } catch (error) {
      logger.error('Authentication error', { error: error instanceof Error ? error.message : String(error) });
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
      const session = await authBridge.getCurrentSession();
      
      if (session) {
        const user = await authBridge.getUserProfile();
        
        set({
          user,
          isAuthenticated: true,
          status: AuthStatus.AUTHENTICATED,
          roles: user?.roles?.map(role => role as unknown as UserRoleEnum) || [],
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
      logger.error('Session refresh error', { error: error instanceof Error ? error.message : String(error) });
      set({
        error: error instanceof Error ? error.message : 'Session refresh error'
      });
    }
  },

  // Check if user has a role
  hasRole: (role) => {
    const { roles } = get();
    
    // Super admin has all roles
    if (roles.includes(UserRoleEnum.SUPERADMIN)) {
      return true;
    }
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  },

  // Set user roles
  setRoles: (roles) => {
    set({ roles });
  },

  // Sign in with email/password
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authBridge.signInWithEmail({ email, password });
      get().initialize();
    } catch (error) {
      logger.error('Sign in error', { error: error instanceof Error ? error.message : String(error) });
      set({
        error: error instanceof Error ? error.message : 'Sign in failed',
        isLoading: false,
        status: AuthStatus.ERROR
      });
      throw error;
    }
  },

  // Sign in with OAuth provider
  signInWithProvider: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      await authBridge.signInWithOAuth(provider);
      // Auth bridge will handle the redirect, no need to update state
    } catch (error) {
      logger.error('OAuth sign in error', { error: error instanceof Error ? error.message : String(error), provider });
      set({
        error: error instanceof Error ? error.message : `Sign in with ${provider} failed`,
        isLoading: false,
        status: AuthStatus.ERROR
      });
      throw error;
    }
  },

  // Sign up new user
  signUp: async (email, password, metadata) => {
    set({ isLoading: true, error: null });
    try {
      await authBridge.signUp({
        email,
        password,
        options: { data: metadata }
      });
      
      const session = await authBridge.getCurrentSession();
      
      if (session) {
        get().initialize();
      } else {
        set({
          isLoading: false,
          status: AuthStatus.UNAUTHENTICATED
        });
      }
    } catch (error) {
      logger.error('Sign up error', { error: error instanceof Error ? error.message : String(error) });
      set({
        error: error instanceof Error ? error.message : 'Sign up failed',
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
      logger.info('User signed out');
    } catch (error) {
      logger.error('Sign out error', { error: error instanceof Error ? error.message : String(error) });
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
      logger.error('Profile update error', { error: error instanceof Error ? error.message : String(error) });
      set({
        error: error instanceof Error ? error.message : 'Profile update failed',
        isLoading: false
      });
      throw error;
    }
  },

  // Password reset
  resetPassword: async (email) => {
    set({ isLoading: true });
    try {
      await authBridge.resetPassword(email);
      set({ isLoading: false });
      logger.info('Password reset requested');
    } catch (error) {
      logger.error('Password reset error', { error: error instanceof Error ? error.message : String(error) });
      set({
        error: error instanceof Error ? error.message : 'Password reset failed',
        isLoading: false
      });
      throw error;
    }
  },

  // Password update
  updatePassword: async (oldPassword, newPassword) => {
    set({ isLoading: true });
    try {
      // Check if user is authenticated
      if (!get().user || !get().isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      await authBridge.updatePassword(oldPassword, newPassword);
      set({ isLoading: false });
      logger.info('Password updated');
    } catch (error) {
      logger.error('Password update error', { error: error instanceof Error ? error.message : String(error) });
      set({
        error: error instanceof Error ? error.message : 'Password update failed',
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
