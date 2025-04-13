
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS, LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

// Define the auth state interface
export interface AuthState {
  // User state
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: string; // Using string instead of enum for comparison
  roles: string[]; // User roles for RBAC
  
  // Session state
  sessionToken: string | null;
  refreshToken: string | null;
  
  // Status and loading state
  error: Error | null;
  initialized: boolean;
  isLoading: boolean;
  
  // Auth actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

// Create the auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  status: AUTH_STATUS.IDLE,
  sessionToken: null,
  refreshToken: null,
  error: null,
  initialized: false,
  isLoading: false,
  roles: [],

  // Initialize the auth state from storage or server
  initialize: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING, isLoading: true });
      
      // Demo implementation - in a real app, verify the stored session
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        const roles = JSON.parse(localStorage.getItem('user_roles') || '[]');
        
        set({ 
          user,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED,
          sessionToken: localStorage.getItem('auth_token'),
          initialized: true,
          isLoading: false,
          roles
        });
        
        logger.log(LogLevel.INFO, LogCategory.AUTH, 'User session restored', { 
          userId: user.id,
          email: user.email
        });
      } else {
        set({
          isAuthenticated: false,
          status: AUTH_STATUS.UNAUTHENTICATED,
          initialized: true,
          isLoading: false,
          roles: []
        });
        
        logger.log(LogLevel.INFO, LogCategory.AUTH, 'No user session found');
      }
    } catch (error) {
      set({ 
        status: AUTH_STATUS.ERROR, 
        error: error as Error,
        initialized: true,
        isLoading: false
      });
      
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to initialize auth', { 
        error 
      });
    }
  },

  // Login the user
  login: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING, isLoading: true });
      
      // Demo implementation - in a real app, call an API
      const demoUser: UserProfile = {
        id: '123',
        email,
        name: 'Demo User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: ['user']
      };
      
      // Store user in local storage for demo
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user_roles', JSON.stringify(['user']));
      
      set({
        user: demoUser,
        isAuthenticated: true,
        status: AUTH_STATUS.AUTHENTICATED,
        sessionToken: 'demo_token',
        error: null,
        isLoading: false,
        roles: ['user']
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User logged in', { 
        userId: demoUser.id, 
        email: demoUser.email 
      });
    } catch (error) {
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error as Error,
        isAuthenticated: false,
        isLoading: false
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
      set({ status: AUTH_STATUS.LOADING, isLoading: true });
      
      // Clear local storage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_roles');
      
      set({
        user: null,
        isAuthenticated: false,
        status: AUTH_STATUS.UNAUTHENTICATED,
        sessionToken: null,
        refreshToken: null,
        error: null,
        isLoading: false,
        roles: []
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User logged out');
    } catch (error) {
      set({
        status: AUTH_STATUS.ERROR,
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
      set({ status: AUTH_STATUS.LOADING, isLoading: true });
      
      // Demo implementation - in a real app, call an API
      const demoUser: UserProfile = {
        id: '123',
        email,
        name: 'New User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: ['user']
      };
      
      // Store user in local storage for demo
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user_roles', JSON.stringify(['user']));
      
      set({
        user: demoUser,
        isAuthenticated: true,
        status: AUTH_STATUS.AUTHENTICATED,
        sessionToken: 'demo_token',
        error: null,
        isLoading: false,
        roles: ['user']
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed up', { 
        userId: demoUser.id, 
        email: demoUser.email 
      });
    } catch (error) {
      set({
        status: AUTH_STATUS.ERROR,
        error: error as Error,
        isLoading: false
      });
      
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Signup failed', { 
        email, 
        error 
      });
    }
  }
}));
