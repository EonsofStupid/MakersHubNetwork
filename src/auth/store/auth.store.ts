
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS, AuthStatus } from '@/shared/types';
import { logger } from '@/logging/logger.service';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: Error | null;
  initialized: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  status: AUTH_STATUS.IDLE,
  error: null,
  initialized: false,

  initialize: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({ 
          user, 
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED,
          initialized: true 
        });
        
        logger.log(LogLevel.INFO, LogCategory.AUTH, 'Auth initialized with stored user');
      } else {
        set({ 
          status: AUTH_STATUS.UNAUTHENTICATED,
          initialized: true 
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
        initialized: true
      });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      // Demo implementation
      const user: UserProfile = {
        id: '1',
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      set({ 
        user,
        isAuthenticated: true,
        status: AUTH_STATUS.AUTHENTICATED,
        error: null
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User logged in', { email });
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Login failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Failed to login')
      });
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem('auth_user');
      set({
        user: null,
        isAuthenticated: false,
        status: AUTH_STATUS.UNAUTHENTICATED,
        error: null
      });
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User logged out');
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Logout failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Failed to logout')
      });
    }
  }
}));
