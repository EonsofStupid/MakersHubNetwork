
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthBridge } from '@/bridges/AuthBridge';

/**
 * Hook to check admin authentication status
 */
export function useAdminAuth() {
  // Use selector to only subscribe to roles
  const roles = useAuthStore(state => state.roles);
  
  // Use AuthBridge for consistent role checks
  const isAdmin = AuthBridge.isAdmin();
  const isSuperAdmin = AuthBridge.isSuperAdmin();
  const hasAdminAccess = isAdmin || isSuperAdmin;
  
  return {
    roles,
    isAdmin,
    isSuperAdmin,
    hasAdminAccess
  };
}
