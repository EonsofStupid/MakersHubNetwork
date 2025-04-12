
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Hook to access auth state using selectors 
 * This provides better performance than accessing the entire store
 */
export function useAuthAtoms() {
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const status = useAuthStore(state => state.status);
  const initialized = useAuthStore(state => state.initialized);
  const error = useAuthStore(state => state.error);
  
  // Compute derived states
  const isLoading = status === 'LOADING';
  const isAuthenticated = status === 'AUTHENTICATED';
  
  return {
    user,
    profile,
    status,
    initialized,
    error,
    isLoading,
    isAuthenticated
  };
}
