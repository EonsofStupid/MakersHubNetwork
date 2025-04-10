
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Hook for checking admin access permissions
 */
export function useAdminAccess() {
  const user = useAuthStore(state => state.user);
  const roles = useAuthStore(state => state.roles);
  const isAdmin = useAuthStore(state => state.isAdmin());
  const isSuperAdmin = useAuthStore(state => state.isSuperAdmin());
  
  return {
    hasAdminAccess: isAdmin || isSuperAdmin,
    isAuthenticated: !!user,
    user
  };
}
