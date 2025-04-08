
import { useAuthStore } from '@/auth/store/auth.store';
import { useMemo } from 'react';

/**
 * Hook for accessing authentication state
 * Returns only the state without any actions to prevent circular dependencies
 * Uses a single selector function for better memoization
 */
export function useAuthState() {
  // Create a memoized selector to prevent recreation on each render
  const selector = useMemo(() => {
    return (state: ReturnType<typeof useAuthStore.getState>) => ({
      user: state.user,
      session: state.session,
      roles: state.roles,
      status: state.status,
      isLoading: state.isLoading,
      error: state.error,
      initialized: state.initialized,
      isAuthenticated: state.isAuthenticated
    });
  }, []);
  
  // Use the stable selector to extract state
  const authState = useAuthStore(selector);
  
  return authState;
}
