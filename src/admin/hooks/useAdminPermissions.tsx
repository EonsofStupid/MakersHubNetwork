
import { useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSIONS, PermissionValue } from '@/auth/permissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for working with admin permissions
 * Maps user roles to admin permissions
 */
export function useAdminPermissions() {
  const { roles, isAdmin, isSuperAdmin, isLoading } = useAuth();
  const logger = useLogger("AdminPermissions", LogCategory.ADMIN);
  
  // Map roles to permissions
  const permissions = useMemo(() => {
    if (isSuperAdmin) {
      logger.info("User has super_admin role, granting all permissions");
      return [PERMISSIONS.SUPER_ADMIN];
    }
    
    if (isAdmin) {
      logger.info("User has admin role, granting admin permissions");
      return [
        PERMISSIONS.ADMIN_ACCESS,
        PERMISSIONS.ADMIN_VIEW,
        PERMISSIONS.ADMIN_EDIT,
        PERMISSIONS.CONTENT_VIEW,
        PERMISSIONS.CONTENT_EDIT,
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.BUILDS_VIEW,
        PERMISSIONS.BUILDS_APPROVE,
        PERMISSIONS.THEMES_VIEW,
        PERMISSIONS.SYSTEM_LOGS
      ];
    }
    
    logger.info("User has no admin permissions");
    return [] as PermissionValue[];
  }, [roles, isAdmin, isSuperAdmin, logger]);
  
  // Check if user has a specific permission
  const hasPermission = useCallback((permission: PermissionValue) => {
    // Super admins have all permissions
    if (permissions.includes(PERMISSIONS.SUPER_ADMIN)) {
      return true;
    }
    
    // Check for specific permission
    return permissions.includes(permission);
  }, [permissions]);
  
  return {
    hasPermission,
    permissions,
    isLoading,
    isAdmin,
    isSuperAdmin
  };
}
