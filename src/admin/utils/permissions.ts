
import { AdminPermission } from '@/admin/types/admin.types';
import { useAdminStore } from '@/admin/store/admin.store';

/**
 * Utility functions for admin permissions
 */
export const checkPermission = (
  permission: AdminPermission,
  userPermissions: AdminPermission[]
): boolean => {
  // Super admin has all permissions
  if (userPermissions.includes('super_admin:all')) {
    return true;
  }
  
  return userPermissions.includes(permission);
};

/**
 * Hook for checking admin permissions
 * @param requiredPermission The permission to check
 * @returns Object with hasPermission boolean and loading state
 */
export const usePermissionCheck = (requiredPermission?: AdminPermission) => {
  const { permissions, isLoadingPermissions, hasPermission } = useAdminStore();
  
  if (!requiredPermission) {
    return { hasPermission: true, isLoading: isLoadingPermissions };
  }
  
  return {
    hasPermission: hasPermission(requiredPermission),
    isLoading: isLoadingPermissions
  };
};
