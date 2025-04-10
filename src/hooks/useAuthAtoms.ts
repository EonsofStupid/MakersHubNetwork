
import { useAuthState } from '@/auth/hooks/useAuthState';

/**
 * Hook to provide authentication state via atoms
 * This abstracts away the authentication implementation details
 */
export function useAuthAtoms() {
  const authState = useAuthState();
  
  return {
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.isAdmin,
    isSuperAdmin: authState.isSuperAdmin,
    user: authState.user,
    profile: authState.profile,
    roles: authState.roles,
    status: authState.status,
    isLoading: authState.isLoading
  };
}
