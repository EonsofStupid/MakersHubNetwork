
import { useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ADMIN_PERMISSIONS, AdminPermissionValue } from '@/admin/constants/permissions';
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
      return [ADMIN_PERMISSIONS.SUPER_ADMIN];
    }
    
    if (isAdmin) {
      logger.info("User has admin role, granting admin permissions");
      return [
        ADMIN_PERMISSIONS.ADMIN_ACCESS,
        ADMIN_PERMISSIONS.ADMIN_VIEW,
        ADMIN_PERMISSIONS.ADMIN_EDIT,
        ADMIN_PERMISSIONS.CONTENT_VIEW,
        ADMIN_PERMISSIONS.CONTENT_EDIT,
        ADMIN_PERMISSIONS.USERS_VIEW,
        ADMIN_PERMISSIONS.BUILDS_VIEW,
        ADMIN_PERMISSIONS.BUILDS_APPROVE,
        ADMIN_PERMISSIONS.THEMES_VIEW,
        ADMIN_PERMISSIONS.SYSTEM_LOGS
      ];
    }
    
    logger.info("User has no admin permissions");
    return [] as AdminPermissionValue[];
  }, [roles, isAdmin, isSuperAdmin, logger]);
  
  // Check if user has a specific permission
  const hasPermission = useCallback((permission: AdminPermissionValue) => {
    // Super admins have all permissions
    if (permissions.includes(ADMIN_PERMISSIONS.SUPER_ADMIN)) {
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

