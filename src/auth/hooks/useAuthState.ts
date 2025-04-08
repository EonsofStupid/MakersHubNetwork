
import { useAuthStore } from '@/auth/store/auth.store';
import { useRef } from 'react';

/**
 * Hook for accessing authentication state
 * Returns only the state without any actions to prevent circular dependencies
 * Uses a single selector function for better memoization
 */
export function useAuthState() {
  // Prevent re-selection on each render by using refs to maintain consistent callback identity
  const selectorRef = useRef((state: ReturnType<typeof useAuthStore.getState>) => ({
    user: state.user,
    session: state.session,
    roles: state.roles,
    status: state.status,
    isLoading: state.isLoading,
    error: state.error,
    initialized: state.initialized,
    isAuthenticated: state.isAuthenticated
  }));
  
  // Use a stable selector to prevent unnecessary re-renders
  const authState = useAuthStore(selectorRef.current);
  
  return authState;
}
