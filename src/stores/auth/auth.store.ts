import { create } from 'zustand';
import { authBridge } from '@/auth/lib/AuthBridgeImpl';
import { UserProfile, UserRole, LogCategory } from '@/shared/types/SharedTypes';
import { useLogger } from '@/hooks/use-logger';

/**
 * Auth store state interface
 */
interface AuthState {
  user: UserProfile | null;
  roles: UserRole[];
  isAuthenticated: boolean;
  isLoading: boolean;
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
 * Handles authentication state and user identity
 */
export const useAuthStore = create<AuthState>((set, get) => {
  const logger = useLogger('AuthStore', LogCategory.AUTH);
  
  return {
    user: null,
    roles: [],
    isAuthenticated: false,
    isLoading: false,
    error: null,
    initialized: false,
    
    /**
     * Sign in with email and password
     */
    signIn: async (email: string, password: string) => {
      try {
        set({ isLoading: true, error: null });
        const { user, error } = await authBridge.signInWithEmail(email, password);
        if (error) throw error;
        set({ 
          user, 
          roles: user?.roles || [], 
          isAuthenticated: true, 
          isLoading: false 
        });
        logger.info('User signed in successfully', { details: { email } });
      } catch (error) {
        set({ error: error as Error, isLoading: false });
        logger.error('Sign in failed', { details: { error: error instanceof Error ? error.message : String(error) } });
        throw error;
      }
    },
    
    /**
     * Sign out current user
     */
    signOut: async () => {
      try {
        set({ isLoading: true, error: null });
        await authBridge.signOut();
        set({ user: null, roles: [], isAuthenticated: false, isLoading: false });
        logger.info('User signed out successfully');
      } catch (error) {
        set({ error: error as Error, isLoading: false });
        logger.error('Sign out failed', { details: { error: error instanceof Error ? error.message : String(error) } });
        throw error;
      }
    },
    
    /**
     * Sign up new user
     */
    signUp: async (email: string, password: string) => {
      try {
        set({ isLoading: true, error: null });
        const { user, error } = await authBridge.signUp(email, password);
        if (error) throw error;
        set({ 
          user, 
          roles: user?.roles || [], 
          isAuthenticated: true, 
          isLoading: false 
        });
        logger.info('User signed up successfully', { details: { email } });
      } catch (error) {
        set({ error: error as Error, isLoading: false });
        logger.error('Sign up failed', { details: { error: error instanceof Error ? error.message : String(error) } });
        throw error;
      }
    },
    
    /**
     * Reset password
     */
    resetPassword: async (email: string) => {
      try {
        set({ isLoading: true, error: null });
        await authBridge.resetPassword(email);
        set({ isLoading: false });
        logger.info('Password reset email sent', { details: { email } });
      } catch (error) {
        set({ error: error as Error, isLoading: false });
        logger.error('Password reset failed', { details: { error: error instanceof Error ? error.message : String(error) } });
        throw error;
      }
    },
    
    /**
     * Initialize auth state
     */
    initialize: async () => {
      try {
        set({ isLoading: true, error: null });
        const session = await authBridge.refreshSession();
        const user = session ? await authBridge.getUserProfile(session.user_id) : null;
        set({ 
          user, 
          roles: user?.roles || [], 
          isAuthenticated: !!user, 
          isLoading: false,
          initialized: true 
        });
        logger.info('Auth state initialized', { details: { isAuthenticated: !!user } });
      } catch (error) {
        set({ 
          error: error as Error, 
          isLoading: false,
          initialized: true 
        });
        logger.error('Auth initialization failed', { details: { error: error instanceof Error ? error.message : String(error) } });
      }
    },
    
    /**
     * Refresh session
     */
    refreshSession: async () => {
      try {
        set({ isLoading: true, error: null });
        const session = await authBridge.refreshSession();
        const user = session ? await authBridge.getUserProfile(session.user_id) : null;
        set({ 
          user, 
          roles: user?.roles || [], 
          isAuthenticated: !!user, 
          isLoading: false 
        });
        logger.info('Session refreshed', { details: { isAuthenticated: !!user } });
      } catch (error) {
        set({ error: error as Error, isLoading: false });
        logger.error('Session refresh failed', { details: { error: error instanceof Error ? error.message : String(error) } });
        throw error;
      }
    }
  };
});

/**
 * Auth bridge for direct access without hooks
 */
export const AuthBridge = {
  /**
   * Get current user
   */
  getUser: () => useAuthStore.getState().user,
  
  /**
   * Get user profile
   */
  getProfile: () => useAuthStore.getState().user,
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => useAuthStore.getState().isAuthenticated,
  
  /**
   * Sign out user
   */
  logout: () => useAuthStore.getState().signOut()
}; 