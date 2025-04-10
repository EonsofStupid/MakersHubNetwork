
import { useAuthStore } from '../store/auth.store';

/**
 * Hook to access auth state without triggering unnecessary re-renders
 */
export function useAuthState() {
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const roles = useAuthStore(state => state.roles);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  
  return {
    user,
    profile,
    roles,
    isAuthenticated,
    status
  };
}

