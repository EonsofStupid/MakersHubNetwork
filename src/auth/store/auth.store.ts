
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS, AuthStatus } from '@/shared/types/SharedTypes';
import { authBridge } from '@/auth/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/SharedTypes';

// Selectors for UI components
export const selectUser = (state: AuthState) => state.user;
export const selectStatus = (state: AuthState) => state.status;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.status === AUTH_STATUS.LOADING;
export const selectError = (state: AuthState) => state.error;

/**
 * Auth store state interface
 */
interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  error: Error | null;
  initialized: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Session methods
  initialize: () => Promise<void>;
  refreshSession: () => Promise<void>;
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
    initialized: false,
    
    /**
     * Sign in with email and password
     */
    signIn: async (email: string, password: string) => {
      try {
        set({ status: AUTH_STATUS.LOADING, error: null });
        const { user, error } = await authBridge.signInWithEmail(email, password);
        
        if (error) throw error;
        
        set({ 
          user, 
          isAuthenticated: !!user, 
          status: AUTH_STATUS.AUTHENTICATED,
          error: null
        });
        
        logger.info('User signed in successfully', { details: { email } });
      } catch (error) {
        set({ 
          error: error as Error, 
          status: AUTH_STATUS.ERROR 
        });
        logger.error('Sign in failed', { details: { error } });
        throw error;
      }
    },
    
    /**
     * Sign out current user
     */
    signOut: async () => {
      try {
        set({ status: AUTH_STATUS.LOADING, error: null });
        await authBridge.signOut();
        set({ 
          user: null, 
          isAuthenticated: false, 
          status: AUTH_STATUS.UNAUTHENTICATED,
          error: null
        });
        logger.info('User signed out successfully');
      } catch (error) {
        set({ 
          error: error as Error, 
          status: AUTH_STATUS.ERROR 
        });
        logger.error('Sign out failed', { details: { error } });
        throw error;
      }
    },
    
    /**
     * Sign up new user
     */
    signUp: async (email: string, password: string) => {
      try {
        set({ status: AUTH_STATUS.LOADING, error: null });
        const { user, error } = await authBridge.signUp(email, password);
        
        if (error) throw error;
        
        set({ 
          user, 
          isAuthenticated: !!user, 
          status: AUTH_STATUS.AUTHENTICATED,
          error: null
        });
        logger.info('User signed up successfully', { details: { email } });
      } catch (error) {
        set({ 
          error: error as Error, 
          status: AUTH_STATUS.ERROR 
        });
        logger.error('Sign up failed', { details: { error } });
        throw error;
      }
    },
    
    /**
     * Reset password
     */
    resetPassword: async (email: string) => {
      try {
        set({ status: AUTH_STATUS.LOADING, error: null });
        await authBridge.resetPassword(email);
        set({ 
          status: AUTH_STATUS.IDLE,
          error: null
        });
        logger.info('Password reset email sent', { details: { email } });
      } catch (error) {
        set({ 
          error: error as Error, 
          status: AUTH_STATUS.ERROR 
        });
        logger.error('Password reset failed', { details: { error } });
        throw error;
      }
    },
    
    /**
     * Initialize auth state
     */
    initialize: async () => {
      try {
        set({ status: AUTH_STATUS.LOADING, error: null });
        const session = await authBridge.getCurrentSession();
        
        if (session?.user) {
          set({
            user: session.user,
            isAuthenticated: true,
            status: AUTH_STATUS.AUTHENTICATED,
            initialized: true,
            error: null
          });
          logger.info('Session initialized', { details: { userId: session.user.id } });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            status: AUTH_STATUS.UNAUTHENTICATED,
            initialized: true,
            error: null
          });
          logger.info('No active session found');
        }
      } catch (error) {
        set({ 
          error: error as Error, 
          status: AUTH_STATUS.ERROR,
          initialized: true
        });
        logger.error('Failed to initialize auth', { details: { error } });
      }
    },
    
    /**
     * Refresh session
     */
    refreshSession: async () => {
      try {
        const session = await authBridge.refreshSession();
        
        if (session?.user_id) {
          const userProfile = await authBridge.getUserProfile(session.user_id);
          
          if (userProfile) {
            set({
              user: userProfile,
              isAuthenticated: true,
              status: AUTH_STATUS.AUTHENTICATED,
              error: null
            });
            logger.info('Session refreshed', { details: { userId: userProfile.id } });
          }
        } else {
          set({
            user: null,
            isAuthenticated: false,
            status: AUTH_STATUS.UNAUTHENTICATED,
            error: null
          });
          logger.info('Session refresh failed - no session');
        }
      } catch (error) {
        set({ 
          error: error as Error, 
          status: AUTH_STATUS.ERROR 
        });
        logger.error('Failed to refresh session', { details: { error } });
        throw error;
      }
    }
  };
});
