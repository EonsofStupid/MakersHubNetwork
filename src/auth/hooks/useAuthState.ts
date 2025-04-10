
import { useAuthStore } from '../store/auth.store';

/**
 * Hook to access auth state without triggering unnecessary re-renders
 * Uses selectors for performance optimization
 */
export function useAuthState() {
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const roles = useAuthStore(state => state.roles);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  
  // Use auth store methods for role checks
  const hasRole = useAuthStore(state => state.hasRole);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const isSuperAdmin = () => roles.includes('super_admin');
  
  return {
    user,
    profile,
    roles,
    isAuthenticated,
    status,
    isLoading,
    error,
    hasRole,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin()
  };
}
