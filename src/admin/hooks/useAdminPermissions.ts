
import { useCallback } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAdminAuth } from './useAdminAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, UserRole } from '@/shared/types/shared.types';

/**
 * Hook for checking admin permissions
 */
export function useAdminPermissions() {
  const auth = useAdminAuth();
  const adminState = useAdminStore();
  const logger = useLogger('useAdminPermissions', LogCategory.AUTH);

  // Check if user has permission
  const hasPermission = useCallback((permission: string): boolean => {
    // If still loading, default to false
    if (adminState.isLoading) {
      return false;
    }

    // Super admins always have all permissions
    if (auth.hasRole(UserRole.SUPER_ADMIN)) {
      return true;
    }

    // Check standard permission mapping
    // This is a simplified implementation - you would typically check against
    // a more sophisticated permission system stored in your auth state
    const permissionMap: Record<string, UserRole[]> = {
      'admin.access': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      'admin.users.edit': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      'admin.users.view': [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR],
      'admin.builds.approve': [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR],
      'admin.settings': [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    };

    const requiredRoles = permissionMap[permission];
    if (!requiredRoles) {
      logger.warn(`Unknown permission requested: ${permission}`);
      return false;
    }

    return requiredRoles.some(role => auth.hasRole(role));
  }, [auth, adminState.isLoading, logger]);

  return {
    hasPermission,
    isLoading: adminState.isLoading || auth.isLoading
  };
}
