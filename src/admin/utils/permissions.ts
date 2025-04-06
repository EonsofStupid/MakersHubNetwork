
import { PermissionValue, PERMISSIONS } from '@/auth/permissions';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';

/**
 * Utility functions for admin permissions
 */
export const hasPermission = (
  permission: PermissionValue,
  userPermissions: PermissionValue[]
): boolean => {
  // Super admin has all permissions
  if (userPermissions.includes(PERMISSIONS.SUPER_ADMIN)) {
    return true;
  }
  
  return userPermissions.includes(permission);
};

/**
 * Hook for checking admin permissions
 * @param requiredPermission The permission to check
 * @returns Object with hasPermission boolean and loading state
 */
export const usePermissionCheck = (requiredPermission?: PermissionValue) => {
  const { hasPermission, isLoaded } = useAdminPermissions();
  
  if (!requiredPermission) {
    return { hasPermission: true, isLoading: !isLoaded };
  }
  
  return {
    hasPermission: hasPermission(requiredPermission),
    isLoading: !isLoaded
  };
};

/**
 * Map a permission to its display name
 * @param permission Permission to get display name for
 */
export function getPermissionDisplayName(permission: PermissionValue): string {
  const displayNames: Record<string, string> = {
    [PERMISSIONS.ADMIN_ACCESS]: 'Admin Access',
    [PERMISSIONS.ADMIN_VIEW]: 'View Admin Panel',
    [PERMISSIONS.ADMIN_EDIT]: 'Edit Admin Settings',
    [PERMISSIONS.CONTENT_VIEW]: 'View Content',
    [PERMISSIONS.CONTENT_EDIT]: 'Edit Content',
    [PERMISSIONS.CONTENT_DELETE]: 'Delete Content',
    [PERMISSIONS.USERS_VIEW]: 'View Users',
    [PERMISSIONS.USERS_EDIT]: 'Edit Users',
    [PERMISSIONS.USERS_DELETE]: 'Delete Users',
    [PERMISSIONS.BUILDS_VIEW]: 'View Builds',
    [PERMISSIONS.BUILDS_APPROVE]: 'Approve Builds',
    [PERMISSIONS.BUILDS_REJECT]: 'Reject Builds',
    [PERMISSIONS.THEMES_VIEW]: 'View Themes',
    [PERMISSIONS.THEMES_EDIT]: 'Edit Themes',
    [PERMISSIONS.THEMES_DELETE]: 'Delete Themes',
    [PERMISSIONS.DATA_VIEW]: 'View Data',
    [PERMISSIONS.DATA_IMPORT]: 'Import/Export Data',
    [PERMISSIONS.SETTINGS_VIEW]: 'View Settings',
    [PERMISSIONS.SETTINGS_EDIT]: 'Edit Settings',
    [PERMISSIONS.SYSTEM_SETTINGS]: 'System Settings',
    [PERMISSIONS.SUPER_ADMIN]: 'All Permissions'
  };
  
  return displayNames[permission] || permission;
}
