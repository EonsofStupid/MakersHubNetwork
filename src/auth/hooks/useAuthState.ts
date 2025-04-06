
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Hook for accessing authentication state
 * Returns only the state without any actions to prevent circular dependencies
 */
export function useAuthState() {
  // Use selector function pattern for better performance
  return useAuthStore(state => ({
    user: state.user,
    session: state.session,
    roles: state.roles,
    status: state.status,
    isLoading: state.isLoading,
    error: state.error,
    initialized: state.initialized,
    isAuthenticated: state.isAuthenticated
  }));
}
