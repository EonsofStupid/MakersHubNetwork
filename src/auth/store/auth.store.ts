
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS, AuthStatus } from '@/auth/types/auth.types';
import { UserRole } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';

interface AuthState {
  user: UserProfile | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: Error | null;
  initialized: boolean;
  isLoading: boolean;
  roles: UserRole[];

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  status: AUTH_STATUS.IDLE,
  error: null,
  initialized: false,
  isLoading: false,
  roles: [],

  initialize: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING, isLoading: true });
      
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        // Extract roles from user metadata if available
        const roles = user.roles || (user.app_metadata?.roles as UserRole[] || []);
        
        set({ 
          user, 
          profile: user,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED,
          initialized: true,
          isLoading: false,
          roles
        });
        
        logger.log(LogLevel.INFO, LogCategory.AUTH, 'Auth initialized with stored user');
      } else {
        set({ 
          status: AUTH_STATUS.UNAUTHENTICATED,
          initialized: true,
          isLoading: false
        });
        
        logger.log(LogLevel.INFO, LogCategory.AUTH, 'Auth initialized without user');
      }
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Auth initialization failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Failed to initialize auth'),
        initialized: true,
        isLoading: false
      });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING, isLoading: true });
      
      // Demo implementation
      const user: UserProfile = {
        id: '1',
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: ['user']
      };
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      set({ 
        user,
        profile: user,
        isAuthenticated: true,
        status: AUTH_STATUS.AUTHENTICATED,
        error: null,
        isLoading: false,
        roles: user.roles || []
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User logged in', { email });
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Login failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Failed to login'),
        isLoading: false
      });
    }
  },

  logout: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING, isLoading: true });
      localStorage.removeItem('auth_user');
      
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        status: AUTH_STATUS.UNAUTHENTICATED,
        error: null,
        isLoading: false,
        roles: []
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User logged out');
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Logout failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Failed to logout'),
        isLoading: false
      });
    }
  },

  signup: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING, isLoading: true });
      
      // Demo implementation
      const user: UserProfile = {
        id: '1',
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: ['user']
      };
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      set({ 
        user,
        profile: user,
        isAuthenticated: true,
        status: AUTH_STATUS.AUTHENTICATED,
        error: null,
        isLoading: false,
        roles: user.roles || []
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed up', { email });
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Signup failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Failed to signup'),
        isLoading: false
      });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING, isLoading: true });
      
      // Demo implementation
      // In a real app, this would call an API to reset the password
      
      set({
        status: AUTH_STATUS.IDLE,
        isLoading: false
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'Password reset requested', { email });
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Password reset failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Failed to reset password'),
        isLoading: false
      });
    }
  },

  updateProfile: async (profileData: Partial<UserProfile>) => {
    try {
      set({ isLoading: true });
      
      const { user } = get();
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Update user profile
      const updatedUser = {
        ...user,
        ...profileData,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      set({ 
        user: updatedUser,
        profile: updatedUser,
        isLoading: false
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'Profile updated');
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Profile update failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      set({ 
        error: error instanceof Error ? error : new Error('Failed to update profile'),
        isLoading: false
      });
    }
  }
}));
