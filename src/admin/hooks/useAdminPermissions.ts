
import { useCallback } from 'react';
import { useHasRole } from '@/auth/hooks/useHasRole'; 
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

/**
 * Hook to check admin permissions
 */
export const useAdminPermissions = () => {
  const { hasRole } = useHasRole();

  /**
   * Check if user has a specific admin permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    // Superadmin has all permissions
    if (hasRole('superadmin')) {
      return true;
    }

    // Admin has basic admin permissions
    if (hasRole('admin') && permission === ADMIN_PERMISSIONS.ADMIN_VIEW) {
      return true;
    }

    // For specific permissions, need to check the actual permission
    // In a real app, this would check against a permissions system
    switch (permission) {
      case ADMIN_PERMISSIONS.ADMIN_VIEW:
        return hasRole(['admin', 'superadmin']);
      case ADMIN_PERMISSIONS.ADMIN_EDIT:
        return hasRole('superadmin');
      case ADMIN_PERMISSIONS.CONTENT_PUBLISH:
        return hasRole(['admin', 'superadmin']);
      case ADMIN_PERMISSIONS.USER_MANAGE:
        return hasRole('superadmin');
      case ADMIN_PERMISSIONS.SYSTEM_SETTINGS:
        return hasRole('superadmin');
      default:
        return false;
    }
  }, [hasRole]);

  /**
   * Check if user is a superadmin
   */
  const isSuperAdmin = useCallback((): boolean => {
    return hasRole('superadmin');
  }, [hasRole]);
  
  return { 
    hasPermission,
    isSuperAdmin 
  };
};
