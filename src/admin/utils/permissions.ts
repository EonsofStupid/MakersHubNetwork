
import { AdminPermissionValue, ADMIN_PERMISSIONS } from '@/admin/constants/permissions';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';

/**
 * Utility functions for admin permissions
 */
export const hasPermission = (
  permission: AdminPermissionValue,
  userPermissions: AdminPermissionValue[]
): boolean => {
  // Super admin has all permissions
  if (userPermissions.includes(ADMIN_PERMISSIONS.SUPER_ADMIN)) {
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
  const { hasPermission, isLoading } = useAdminPermissions();
  
  if (!requiredPermission) {
    return { hasPermission: true, isLoading };
  }
  
  return {
    hasPermission: hasPermission(requiredPermission),
    isLoading
  };
};

/**
 * Map a permission to its display name
 * @param permission Permission to get display name for
 */
export function getPermissionDisplayName(permission: AdminPermissionValue): string {
  const displayNames: Record<string, string> = {
    [ADMIN_PERMISSIONS.ADMIN_ACCESS]: 'Admin Access',
    [ADMIN_PERMISSIONS.ADMIN_VIEW]: 'View Admin Panel',
    [ADMIN_PERMISSIONS.ADMIN_EDIT]: 'Edit Admin Settings',
    [ADMIN_PERMISSIONS.CONTENT_VIEW]: 'View Content',
    [ADMIN_PERMISSIONS.CONTENT_EDIT]: 'Edit Content',
    [ADMIN_PERMISSIONS.CONTENT_DELETE]: 'Delete Content',
    [ADMIN_PERMISSIONS.USERS_VIEW]: 'View Users',
    [ADMIN_PERMISSIONS.USERS_EDIT]: 'Edit Users',
    [ADMIN_PERMISSIONS.USERS_DELETE]: 'Delete Users',
    [ADMIN_PERMISSIONS.BUILDS_VIEW]: 'View Builds',
    [ADMIN_PERMISSIONS.BUILDS_APPROVE]: 'Approve Builds',
    [ADMIN_PERMISSIONS.BUILDS_REJECT]: 'Reject Builds',
    [ADMIN_PERMISSIONS.THEMES_VIEW]: 'View Themes',
    [ADMIN_PERMISSIONS.THEMES_EDIT]: 'Edit Themes',
    [ADMIN_PERMISSIONS.THEMES_DELETE]: 'Delete Themes',
    [ADMIN_PERMISSIONS.DATA_VIEW]: 'View Data',
    [ADMIN_PERMISSIONS.DATA_IMPORT]: 'Import/Export Data',
    [ADMIN_PERMISSIONS.SETTINGS_VIEW]: 'View Settings',
    [ADMIN_PERMISSIONS.SETTINGS_EDIT]: 'Edit Settings',
    [ADMIN_PERMISSIONS.SYSTEM_SETTINGS]: 'System Settings',
    [ADMIN_PERMISSIONS.SUPER_ADMIN]: 'All Permissions'
  };
  
  return displayNames[permission] || permission;
}
