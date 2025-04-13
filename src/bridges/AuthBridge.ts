import { useAuthStore } from '@/stores/authStore';
import { UserProfile, AuthStatus, AUTH_STATUS } from '@/types/shared';

/**
 * AuthBridge
 * Provides a clean interface for components to interact with auth state
 * without directly accessing Zustand
 */
export const AuthBridge = {
  /**
   * Get current user
   */
  getUser: (): UserProfile | null => {
    return useAuthStore.getState().user;
  },
  
  /**
   * Get auth status
   */
  getStatus: (): AuthStatus => {
    return useAuthStore.getState().status;
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return useAuthStore.getState().status === AUTH_STATUS.AUTHENTICATED;
  },
  
  /**
   * Check if auth is initialized
   */
  isInitialized: (): boolean => {
    return useAuthStore.getState().initialized;
  },
  
  /**
   * Check if auth is loading
   */
  isLoading: (): boolean => {
    return useAuthStore.getState().status === AUTH_STATUS.LOADING;
  },
  
  /**
   * Get auth error
   */
  getError: (): Error | null => {
    return useAuthStore.getState().error;
  },
  
  /**
   * Sign in
   */
  signIn: async (email: string, password: string): Promise<void> => {
    return useAuthStore.getState().signIn(email, password);
  },
  
  /**
   * Sign out
   */
  signOut: async (): Promise<void> => {
    return useAuthStore.getState().signOut();
  },
  
  /**
   * Sign up
   */
  signUp: async (email: string, password: string): Promise<void> => {
    return useAuthStore.getState().signUp(email, password);
  },
  
  /**
   * Reset password
   */
  resetPassword: async (email: string): Promise<void> => {
    return useAuthStore.getState().resetPassword(email);
  },
  
  /**
   * Initialize auth
   */
  initialize: async (): Promise<void> => {
    return useAuthStore.getState().initialize();
  },
  
  /**
   * Refresh session
   */
  refreshSession: async (): Promise<void> => {
    return useAuthStore.getState().refreshSession();
  }
};
