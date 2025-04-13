
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS, AuthStatus, LOG_CATEGORY } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

/**
 * Auth store state interface
 */
interface AuthState {
  // State
  user: UserProfile | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  error: Error | null;
  initialized: boolean;
  
  // Auth lifecycle
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // User management
  setUser: (user: UserProfile | null) => void;
  clearUser: () => void;
  
  // Error management
  setError: (error: Error | null) => void;
  clearError: () => void;
}

/**
 * Auth store implementation
 * Manages authentication state
 */
export const useAuthStore = create<AuthState>((set, get) => {
  const logger = { 
    info: (message: string, details?: Record<string, unknown>) => console.log(`[AUTH] ${message}`, details),
    error: (message: string, details?: Record<string, unknown>) => console.error(`[AUTH] ${message}`, details)
  };
  
  return {
    user: null,
    status: AUTH_STATUS.IDLE,
    isAuthenticated: false,
    error: null,
    initialized: false,
    
    /**
     * Initialize auth state
     */
    initialize: async () => {
      set({ status: AUTH_STATUS.LOADING });
      try {
        // In a real app, we would check for an existing session here
        // For now, we'll just transition to unauthenticated
        set({ 
          status: AUTH_STATUS.UNAUTHENTICATED,
          initialized: true
        });
        logger.info('Auth initialized');
      } catch (err: any) {
        set({ 
          status: AUTH_STATUS.ERROR, 
          error: err instanceof Error ? err : new Error(err?.message || 'Unknown error'),
          initialized: true
        });
        logger.error('Auth initialization error', { details: { message: err?.message } });
      }
    },
    
    /**
     * Log a user in
     */
    login: async (email: string, password: string) => {
      set({ status: AUTH_STATUS.LOADING });
      try {
        // In a real app, we would call an auth service here
        // For now, we'll just log a message
        logger.info('Login attempted', { details: { email } });
        
        // This would be replaced with actual login logic
        setTimeout(() => {
          const mockUser: UserProfile = {
            id: '123',
            email,
            name: 'Test User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          set({ 
            user: mockUser,
            status: AUTH_STATUS.AUTHENTICATED,
            isAuthenticated: true,
            error: null
          });
          
          logger.info('Login successful', { details: { email } });
        }, 1000);
      } catch (err: any) {
        set({ 
          status: AUTH_STATUS.ERROR,
          error: err instanceof Error ? err : new Error(err?.message || 'Login failed')
        });
        logger.error('Login error', { details: { message: err?.message } });
      }
    },
    
    /**
     * Register a new user
     */
    register: async (email: string, password: string) => {
      set({ status: AUTH_STATUS.LOADING });
      try {
        // In a real app, we would call a registration service here
        // For now, we'll just log a message
        logger.info('Registration attempted', { details: { email } });
        
        // This would be replaced with actual registration logic
        setTimeout(() => {
          const mockUser: UserProfile = {
            id: '123',
            email,
            name: 'New User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          set({ 
            user: mockUser,
            status: AUTH_STATUS.AUTHENTICATED,
            isAuthenticated: true,
            error: null
          });
          
          logger.info('Registration successful', { details: { email } });
        }, 1000);
      } catch (err: any) {
        set({ 
          status: AUTH_STATUS.ERROR,
          error: err instanceof Error ? err : new Error(err?.message || 'Registration failed')
        });
        logger.error('Registration error', { details: { message: err?.message } });
      }
    },
    
    /**
     * Log the user out
     */
    logout: async () => {
      set({ status: AUTH_STATUS.LOADING });
      try {
        // In a real app, we would call a logout service here
        // For now, we'll just log a message and clear the user
        logger.info('Logout attempted');
        
        set({
          user: null,
          status: AUTH_STATUS.UNAUTHENTICATED,
          isAuthenticated: false,
          error: null
        });
        
        logger.info('Logout successful');
      } catch (err: any) {
        set({ 
          status: AUTH_STATUS.ERROR,
          error: err instanceof Error ? err : new Error(err?.message || 'Logout failed')
        });
        logger.error('Logout error', { details: { message: err?.message } });
      }
    },
    
    /**
     * Reset a user's password
     */
    resetPassword: async (email: string) => {
      set({ status: AUTH_STATUS.LOADING });
      try {
        // In a real app, we would call a password reset service here
        // For now, we'll just log a message
        logger.info('Password reset attempted', { details: { email } });
        
        // This would be replaced with actual password reset logic
        setTimeout(() => {
          set({ 
            status: get().user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED,
            error: null
          });
          
          logger.info('Password reset email sent', { details: { email } });
        }, 1000);
      } catch (err: any) {
        set({ 
          status: AUTH_STATUS.ERROR,
          error: err instanceof Error ? err : new Error(err?.message || 'Password reset failed')
        });
        logger.error('Password reset error', { details: { message: err?.message } });
      }
    },
    
    /**
     * Set the current user
     */
    setUser: (user: UserProfile | null) => {
      set({ 
        user, 
        status: user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED,
        isAuthenticated: !!user,
        error: null
      });
      
      if (user) {
        logger.info('User session updated', { details: { email: user.email } });
      } else {
        logger.info('User session cleared');
      }
    },
    
    /**
     * Clear the current user
     */
    clearUser: () => {
      set({ 
        user: null, 
        status: AUTH_STATUS.UNAUTHENTICATED,
        isAuthenticated: false
      });
      logger.info('User session cleared');
    },
    
    /**
     * Set an error
     */
    setError: (error: Error | null) => {
      set({ 
        error,
        status: error ? AUTH_STATUS.ERROR : get().status
      });
      
      if (error) {
        logger.error('Auth error occurred', { details: { message: error.message } });
      }
    },
    
    /**
     * Clear the current error
     */
    clearError: () => {
      set({ error: null });
    }
  };
});

// Provide selector exports for easier component usage
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectAuthStatus = (state: AuthState) => state.status;
export const selectAuthError = (state: AuthState) => state.error;
