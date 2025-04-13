
import { useCallback } from 'react';
import { RBACBridge } from '@/rbac/bridge';
import { UserRole, LOG_CATEGORY } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

/**
 * Hook for admin role-based access control
 * Provides role-checking utilities specific to admin functionality
 */
export const useAdminRoles = () => {
  const logger = useLogger('useAdminRoles', LOG_CATEGORY.RBAC);
  const roles = RBACBridge.getRoles();
  
  // Check if user has specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  }, []);
  
  // Check if user has general admin access
  const hasAdminAccess = useCallback((): boolean => {
    return RBACBridge.hasAdminAccess();
  }, []);
  
  // Check if user has super admin access
  const isSuperAdmin = useCallback((): boolean => {
    return RBACBridge.isSuperAdmin();
  }, []);
  
  // Log access attempt
  const logAccessAttempt = useCallback((resource: string, granted: boolean) => {
    if (granted) {
      logger.info(`Access granted to ${resource}`, {
        details: { roles, resource }
      });
    } else {
      logger.warn(`Access denied to ${resource}`, {
        details: { roles, resource }
      });
    }
  }, [logger, roles]);
  
  return {
    roles,
    hasRole,
    hasAdminAccess,
    isSuperAdmin,
    logAccessAttempt
  };
};
