
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS, AuthStatus } from '@/shared/types/SharedTypes';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/SharedTypes';

/**
 * Auth store state interface
 */
interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  error: Error | null;
  
  // User management
  setUser: (user: UserProfile | null) => void;
  clearUser: () => void;
  
  // Error management
  setError: (error: Error | null) => void;
  clearError: () => void;
}

/**
 * Auth store implementation
 * Manages only authentication state, not roles
 */
export const useAuthStore = create<AuthState>((set, get) => {
  const logger = useLogger('AuthStore', LogCategory.AUTH);
  
  return {
    user: null,
    status: AUTH_STATUS.IDLE,
    isAuthenticated: false,
    error: null,
    
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
