import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/auth.store';
import { useRbac } from '@/auth/rbac/use-rbac';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * Hook for checking and managing admin access
 * 
 * Provides comprehensive data about user's admin status and permissions
 */
export function useAdminAuth() {
  const { user, roles, isAuthenticated, isLoading } = useAuthStore();
  const { hasAdminAccess, isSuperAdmin } = useRbac();
  const logger = useLogger('AdminAccess', LogCategory.ADMIN);
  
  // Log admin access check
  useEffect(() => {
    if (isAuthenticated && hasAdminAccess()) {
      logger.info('Admin access granted', {
        details: {
          userId: user?.id,
          roles,
          isAdmin: hasAdminAccess(),
          isSuperAdmin: isSuperAdmin()
        }
      });
    } else if (isAuthenticated) {
      logger.debug('Admin access check - user is not admin', {
        details: {
          userId: user?.id,
          roles
        }
      });
    }
  }, [isAuthenticated, hasAdminAccess, user?.id, roles, logger, isSuperAdmin]);
  
  return {
    isAuthenticated,
    isAdmin: hasAdminAccess(),
    isSuperAdmin: isSuperAdmin(),
    hasAdminAccess: hasAdminAccess(),
    roles,
    isLoading,
    user
  };
}

export default useAdminAuth;
