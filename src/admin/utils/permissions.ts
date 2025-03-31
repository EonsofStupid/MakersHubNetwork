
import { AdminPermissionValue, AdminPermissions } from '@/admin/constants/permissions';

/**
 * Utility functions for admin permissions
 */
export const checkPermission = (
  permission: AdminPermissionValue,
  userPermissions: AdminPermissionValue[]
): boolean => {
  // Super admin has all permissions
  if (userPermissions.includes(AdminPermissions.SUPER_ADMIN)) {
    return true;
  }
  
  return userPermissions.includes(permission);
};

/**
 * Hook for checking admin permissions
 * @param requiredPermission The permission to check
 * @returns Object with hasPermission boolean and loading state
 */
export const usePermissionCheck = (requiredPermission?: AdminPermissionValue) => {
  const { permissions, isLoadingPermissions, hasPermission } = useAdminStore();
  
  if (!requiredPermission) {
    return { hasPermission: true, isLoading: isLoadingPermissions };
  }
  
  return {
    hasPermission: hasPermission(requiredPermission),
    isLoading: isLoadingPermissions
  };
};

/**
 * Map a permission to its display name
 * @param permission Permission to get display name for
 */
export function getPermissionDisplayName(permission: AdminPermissionValue): string {
  const displayNames: Record<string, string> = {
    [AdminPermissions.ADMIN_ACCESS]: 'Admin Access',
    [AdminPermissions.ADMIN_VIEW]: 'View Admin Panel',
    [AdminPermissions.ADMIN_EDIT]: 'Edit Admin Settings',
    [AdminPermissions.CONTENT_VIEW]: 'View Content',
    [AdminPermissions.CONTENT_EDIT]: 'Edit Content',
    [AdminPermissions.CONTENT_DELETE]: 'Delete Content',
    [AdminPermissions.USERS_VIEW]: 'View Users',
    [AdminPermissions.USERS_EDIT]: 'Edit Users',
    [AdminPermissions.USERS_DELETE]: 'Delete Users',
    [AdminPermissions.BUILDS_VIEW]: 'View Builds',
    [AdminPermissions.BUILDS_APPROVE]: 'Approve Builds',
    [AdminPermissions.BUILDS_REJECT]: 'Reject Builds',
    [AdminPermissions.THEMES_VIEW]: 'View Themes',
    [AdminPermissions.THEMES_EDIT]: 'Edit Themes',
    [AdminPermissions.THEMES_DELETE]: 'Delete Themes',
    [AdminPermissions.DATA_VIEW]: 'View Data',
    [AdminPermissions.DATA_IMPORT]: 'Import/Export Data',
    [AdminPermissions.SETTINGS_VIEW]: 'View Settings',
    [AdminPermissions.SETTINGS_EDIT]: 'Edit Settings',
    [AdminPermissions.SUPER_ADMIN]: 'All Permissions'
  };
  
  return displayNames[permission] || permission;
}
