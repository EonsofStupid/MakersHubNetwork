import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { authBridge } from '@/auth/bridge';
import { UserRoleEnum } from '@/shared/types/shared.types';

/**
 * Hook for checking and managing admin access
 * 
 * Provides comprehensive data about user's admin status and permissions
 */
export function useAdminAccess() {
  const { user, roles } = useAuthStore();
  const logger = useLogger('AdminAccess', LogCategory.ADMIN);
  
  const isAuthenticated = !!user;
  const isAdmin = roles.includes(UserRoleEnum.ADMIN);
  const isSuperAdmin = roles.includes(UserRoleEnum.SUPERADMIN);
  const hasAdminAccess = isAdmin || isSuperAdmin;
  const hasSuperAdminAccess = isSuperAdmin;
  
  // Log admin access check
  useEffect(() => {
    if (isAuthenticated && hasAdminAccess) {
      logger.info('Admin access granted', {
        details: {
          userId: user?.id,
          roles,
          isAdmin,
          isSuperAdmin
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
  }, [isAuthenticated, hasAdminAccess, user?.id, roles, logger, isAdmin, isSuperAdmin]);
  
  return {
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    hasAdminAccess,
    hasSuperAdminAccess,
    roles,
    isLoading: false,
    user
  };
}
