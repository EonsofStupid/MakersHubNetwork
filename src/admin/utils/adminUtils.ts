
import { PermissionValue, PERMISSIONS } from "@/auth/permissions";

/**
 * Map section names to their required permissions
 * Used for both navigation and feature access control
 */
export const sectionPermissionMap: Record<string, PermissionValue> = {
  'overview': PERMISSIONS.ADMIN_ACCESS,
  'users': PERMISSIONS.USERS_VIEW,
  'content': PERMISSIONS.CONTENT_VIEW,
  'builds': PERMISSIONS.BUILDS_VIEW,
  'data': PERMISSIONS.DATA_VIEW,
  'themes': PERMISSIONS.THEMES_VIEW,
  'settings': PERMISSIONS.SETTINGS_VIEW,
  'analytics': PERMISSIONS.ADMIN_ACCESS
};

/**
 * Check if the specified permissions include admin access
 * @param permissions Array of permissions to check
 */
export function hasAdminAccess(permissions: PermissionValue[]): boolean {
  return permissions.some(p => 
    p === PERMISSIONS.ADMIN_ACCESS || 
    p === PERMISSIONS.ADMIN_VIEW || 
    p === PERMISSIONS.SUPER_ADMIN
  );
}

/**
 * Group permissions by category for the UI
 */
export function getPermissionGroups() {
  return [
    {
      name: 'Admin',
      permissions: [
        PERMISSIONS.ADMIN_ACCESS,
        PERMISSIONS.ADMIN_VIEW,
        PERMISSIONS.ADMIN_EDIT
      ] as PermissionValue[]
    },
    {
      name: 'Content',
      permissions: [
        PERMISSIONS.CONTENT_VIEW,
        PERMISSIONS.CONTENT_EDIT,
        PERMISSIONS.CONTENT_DELETE
      ] as PermissionValue[]
    },
    {
      name: 'Users',
      permissions: [
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.USERS_EDIT,
        PERMISSIONS.USERS_DELETE
      ] as PermissionValue[]
    },
    {
      name: 'Builds',
      permissions: [
        PERMISSIONS.BUILDS_VIEW,
        PERMISSIONS.BUILDS_APPROVE,
        PERMISSIONS.BUILDS_REJECT // Now this exists in PERMISSIONS
      ] as PermissionValue[]
    },
    {
      name: 'Themes',
      permissions: [
        PERMISSIONS.THEMES_VIEW,
        PERMISSIONS.THEMES_EDIT,
        PERMISSIONS.THEMES_DELETE
      ] as PermissionValue[]
    },
    {
      name: 'Data',
      permissions: [
        PERMISSIONS.DATA_VIEW,
        PERMISSIONS.DATA_IMPORT
      ] as PermissionValue[]
    },
    {
      name: 'Settings',
      permissions: [
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_EDIT
      ] as PermissionValue[]
    }
  ];
}
