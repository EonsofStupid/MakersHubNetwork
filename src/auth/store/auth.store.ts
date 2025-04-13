
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

// Define the auth state interface
export interface AuthState {
  // User state
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: string; // Using string instead of enum for comparison
  
  // Session state
  sessionToken: string | null;
  refreshToken: string | null;
  
  // Status and loading state
  error: Error | null;
  initialized: boolean;
  
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

  // Initialize the auth state from storage or server
  initialize: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      // Demo implementation - in a real app, verify the stored session
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        set({ 
          user,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED,
          sessionToken: localStorage.getItem('auth_token'),
          initialized: true
        });
        
        logger.info('User session restored', 'auth', { 
          userId: user.id,
          email: user.email
        });
      } else {
        set({
          isAuthenticated: false,
          status: AUTH_STATUS.UNAUTHENTICATED,
          initialized: true
        });
        
        logger.info('No user session found', 'auth');
      }
    } catch (error) {
      set({ 
        status: AUTH_STATUS.ERROR, 
        error: error as Error,
        initialized: true
      });
      
      logger.error('Failed to initialize auth', 'auth', { 
        error 
      });
    }
  },

  // Login the user
  login: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      // Demo implementation - in a real app, call an API
      const demoUser: UserProfile = {
        id: '123',
        email,
        name: 'Demo User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Store user in local storage for demo
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_token', 'demo_token');
      
      set({
        user: demoUser,
        isAuthenticated: true,
        status: AUTH_STATUS.AUTHENTICATED,
        sessionToken: 'demo_token',
        error: null
      });
      
      logger.info('User logged in', 'auth', { 
        userId: demoUser.id, 
        email: demoUser.email 
      });
    } catch (error) {
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error as Error,
        isAuthenticated: false
      });
      
      logger.error('Login failed', 'auth', { 
        email, 
        error 
      });
    }
  },

  // Logout the user
  logout: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      // Clear local storage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      
      set({
        user: null,
        isAuthenticated: false,
        status: AUTH_STATUS.UNAUTHENTICATED,
        sessionToken: null,
        refreshToken: null,
        error: null
      });
      
      logger.info('User logged out', 'auth');
    } catch (error) {
      set({
        status: AUTH_STATUS.ERROR,
        error: error as Error
      });
      
      logger.error('Logout failed', 'auth', { 
        error 
      });
    }
  },

  // Sign up a new user
  signup: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      // Demo implementation - in a real app, call an API
      const demoUser: UserProfile = {
        id: '123',
        email,
        name: 'New User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Store user in local storage for demo
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_token', 'demo_token');
      
      set({
        user: demoUser,
        isAuthenticated: true,
        status: AUTH_STATUS.AUTHENTICATED,
        sessionToken: 'demo_token',
        error: null
      });
      
      logger.info('User signed up', 'auth', { 
        userId: demoUser.id, 
        email: demoUser.email 
      });
    } catch (error) {
      set({
        status: AUTH_STATUS.ERROR,
        error: error as Error
      });
      
      logger.error('Signup failed', 'auth', { 
        email, 
        error 
      });
    }
  }
}));
