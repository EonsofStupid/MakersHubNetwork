
import { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { authBridge } from '@/auth/bridge';

/**
 * Hook for checking and managing admin access
 * 
 * Provides comprehensive data about user's admin status and permissions
 */
export function useAdminAccess() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const roles = useAuthStore(state => state.roles);
  const status = useAuthStore(state => state.status);
  const logger = useLogger('AdminAccess', LogCategory.ADMIN);
  
  const isAdmin = authBridge.isAdmin();
  const isSuperAdmin = authBridge.isSuperAdmin();
  const hasAdminAccess = isAdmin || isSuperAdmin;
  
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
    roles,
    isLoading: status === 'loading',
    user
  };
}
