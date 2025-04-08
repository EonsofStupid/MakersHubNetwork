
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Hook for accessing authentication state
 * Returns only the state without any actions to prevent circular dependencies
 * Uses a single selector function for better memoization
 */
export function useAuthState() {
  // Use a single selector function to prevent multiple subscriptions
  const authState = useAuthStore(state => ({
    user: state.user,
    session: state.session,
    roles: state.roles,
    status: state.status,
    isLoading: state.isLoading,
    error: state.error,
    initialized: state.initialized,
    isAuthenticated: state.isAuthenticated
  }));
  
  return authState;
}
