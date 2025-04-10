
import { useAuthStore } from '@/auth/store/auth.store';
import { useHasAdminAccess, useIsSuperAdmin } from '@/auth/hooks/useHasRole';
import { getLogger } from '@/logging';

/**
 * Hook for checking admin access permissions
 * Uses the standardized role checking system
 */
export function useAdminAccess() {
  const logger = getLogger();
  const user = useAuthStore(state => state.user);
  const roles = useAuthStore(state => state.roles);
  
  // Use our standardized hooks
  const isAdmin = useAuthStore(state => state.isAdmin());
  const isSuperAdmin = useAuthStore(state => state.isSuperAdmin());
  const hasAdminAccess = isAdmin || isSuperAdmin;
  
  // Log authentication status for debugging
  logger.debug('Admin access check', { 
    details: { 
      hasAdminAccess,
      isAdmin,
      isSuperAdmin,
      roles,
      userId: user?.id
    }
  });
  
  return {
    hasAdminAccess,
    isAdmin,
    isSuperAdmin,
    isAuthenticated: !!user,
    user,
    roles
  };
}
