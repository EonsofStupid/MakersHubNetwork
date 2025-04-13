
import { create } from 'zustand';
import { UserProfile, AuthStatus, LogCategory, LogLevel, UserRole, ROLES } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';
import { RBACBridge } from '@/rbac/bridge';

// Define the auth state interface
export interface AuthState {
  // User state
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  
  // Session state
  sessionToken: string | null;
  refreshToken: string | null;
  
  // Profile information
  profile: UserProfile | null;

  // Role information
  roles: UserRole[];
  
  // Status and loading state
  error: Error | null;
  initialized: boolean;
  isLoading: boolean;
  
  // Auth actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

// Create the auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  profile: null,
  isAuthenticated: false,
  status: AuthStatus.IDLE,
  sessionToken: null,
  refreshToken: null,
  error: null,
  initialized: false,
  isLoading: false,
  roles: [],

  // Initialize the auth state from storage or server
  initialize: async () => {
    try {
      set({ status: AuthStatus.LOADING, isLoading: true });
      
      // Demo implementation - in a real app, verify the stored session
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        const rolesStr = localStorage.getItem('user_roles');
        const roles = rolesStr ? JSON.parse(rolesStr) as UserRole[] : [ROLES.USER];
        
        // Set roles in RBAC bridge
        RBACBridge.setRoles(roles);
        
        set({ 
          user,
          profile: user,
          roles,
          isAuthenticated: true,
          status: AuthStatus.AUTHENTICATED,
          sessionToken: localStorage.getItem('auth_token'),
          initialized: true,
          isLoading: false
        });
        
        logger.log(LogLevel.INFO, LogCategory.AUTH, 'User session restored', { 
          userId: user.id,
          email: user.email,
          roles
        });
      } else {
        set({
          isAuthenticated: false,
          status: AuthStatus.UNAUTHENTICATED,
          initialized: true,
          isLoading: false,
          roles: [],
        });
        
        logger.log(LogLevel.INFO, LogCategory.AUTH, 'No user session found');
      }
    } catch (error) {
      set({ 
        status: AuthStatus.ERROR, 
        error: error as Error,
        initialized: true,
        isLoading: false,
        roles: [],
      });
      
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to initialize auth', { 
        error 
      });
    }
  },

  // Login the user
  login: async (email: string, password: string) => {
    try {
      set({ status: AuthStatus.LOADING, isLoading: true });
      
      // Mock admin authentication for testing
      let roles: UserRole[] = [ROLES.USER];
      
      // Admin testing credentials
      if (email === 'admin@example.com' && password === 'admin123') {
        roles = [ROLES.ADMIN];
      } else if (email === 'superadmin@example.com' && password === 'super123') {
        roles = [ROLES.SUPER_ADMIN];
      }
      
      // Demo implementation - in a real app, call an API
      const demoUser: UserProfile = {
        id: '123',
        email,
        name: 'Demo User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Store user in local storage for demo
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user_roles', JSON.stringify(roles));
      
      // Set roles in RBAC bridge
      RBACBridge.setRoles(roles);
      
      set({
        user: demoUser,
        profile: demoUser,
        roles,
        isAuthenticated: true,
        status: AuthStatus.AUTHENTICATED,
        sessionToken: 'demo_token',
        error: null,
        isLoading: false,
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User logged in', { 
        userId: demoUser.id, 
        email: demoUser.email,
        roles
      });
    } catch (error) {
      set({ 
        status: AuthStatus.ERROR,
        error: error as Error,
        isAuthenticated: false,
        isLoading: false,
        roles: [],
      });
      
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Login failed', { 
        email, 
        error 
      });
    }
  },

  // Logout the user
  logout: async () => {
    try {
      set({ status: AuthStatus.LOADING, isLoading: true });
      
      // Clear local storage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_roles');
      
      // Clear roles in RBAC bridge
      RBACBridge.clearRoles();
      
      set({
        user: null,
        profile: null,
        roles: [],
        isAuthenticated: false,
        status: AuthStatus.UNAUTHENTICATED,
        sessionToken: null,
        refreshToken: null,
        error: null,
        isLoading: false,
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User logged out');
    } catch (error) {
      set({
        status: AuthStatus.ERROR,
        error: error as Error,
        isLoading: false
      });
      
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Logout failed', { 
        error 
      });
    }
  },

  // Sign up a new user
  signup: async (email: string, password: string) => {
    try {
      set({ status: AuthStatus.LOADING, isLoading: true });
      
      // Demo implementation - in a real app, call an API
      const demoUser: UserProfile = {
        id: '123',
        email,
        name: 'New User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Store user in local storage for demo
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user_roles', JSON.stringify([ROLES.USER]));
      
      // Set roles in RBAC bridge
      RBACBridge.setRoles([ROLES.USER]);
      
      set({
        user: demoUser,
        profile: demoUser,
        roles: [ROLES.USER],
        isAuthenticated: true,
        status: AuthStatus.AUTHENTICATED,
        sessionToken: 'demo_token',
        error: null,
        isLoading: false,
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed up', { 
        userId: demoUser.id, 
        email: demoUser.email 
      });
    } catch (error) {
      set({
        status: AuthStatus.ERROR,
        error: error as Error,
        isLoading: false
      });
      
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Signup failed', { 
        email, 
        error 
      });
    }
  },
  
  // Register alias for signup
  register: async (email: string, password: string) => {
    return get().signup(email, password);
  },
  
  // Reset password
  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true });
      
      // Demo implementation - in a real app, call an API
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'Password reset email sent', { 
        email 
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error as Error,
        isLoading: false
      });
      
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Password reset failed', { 
        email, 
        error 
      });
    }
  },
  
  // Update user profile
  updateProfile: async (profile: Partial<UserProfile>) => {
    try {
      set({ isLoading: true });
      
      // Get current user
      const { user } = get();
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Update user in storage
      const updatedUser = {
        ...user,
        ...profile,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      set({
        user: updatedUser,
        profile: updatedUser,
        isLoading: false
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User profile updated', { 
        userId: user.id
      });
    } catch (error) {
      set({
        error: error as Error,
        isLoading: false
      });
      
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Profile update failed', { 
        error 
      });
    }
  }
}));
