
import { AdminPermission } from "@/admin/types/admin.types";
import { ADMIN_PERMISSIONS } from "@/admin/constants/permissions";

/**
 * Map section names to their required permissions
 * Used for both navigation and feature access control
 */
export const sectionPermissionMap: Record<string, AdminPermission> = {
  'overview': ADMIN_PERMISSIONS.ADMIN_ACCESS,
  'users': ADMIN_PERMISSIONS.USERS_VIEW,
  'content': ADMIN_PERMISSIONS.CONTENT_VIEW,
  'builds': ADMIN_PERMISSIONS.BUILDS_VIEW,
  'data': ADMIN_PERMISSIONS.DATA_VIEW,
  'themes': ADMIN_PERMISSIONS.THEMES_VIEW,
  'settings': ADMIN_PERMISSIONS.SYSTEM_SETTINGS,
  'analytics': ADMIN_PERMISSIONS.ADMIN_ACCESS
};

/**
 * Check if the specified permissions include admin access
 * @param permissions Array of permissions to check
 */
export function hasAdminAccess(permissions: AdminPermission[]): boolean {
  return permissions.some(p => 
    p === ADMIN_PERMISSIONS.ADMIN_ACCESS || 
    p === ADMIN_PERMISSIONS.ADMIN_VIEW || 
    p === ADMIN_PERMISSIONS.SUPER_ADMIN
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
        ADMIN_PERMISSIONS.ADMIN_ACCESS,
        ADMIN_PERMISSIONS.ADMIN_VIEW,
        ADMIN_PERMISSIONS.ADMIN_EDIT
      ] as AdminPermission[]
    },
    {
      name: 'Content',
      permissions: [
        ADMIN_PERMISSIONS.CONTENT_VIEW,
        ADMIN_PERMISSIONS.CONTENT_EDIT,
        ADMIN_PERMISSIONS.CONTENT_DELETE
      ] as AdminPermission[]
    },
    {
      name: 'Users',
      permissions: [
        ADMIN_PERMISSIONS.USERS_VIEW,
        ADMIN_PERMISSIONS.USERS_EDIT,
        ADMIN_PERMISSIONS.USERS_DELETE
      ] as AdminPermission[]
    },
    {
      name: 'Builds',
      permissions: [
        ADMIN_PERMISSIONS.BUILDS_VIEW,
        ADMIN_PERMISSIONS.BUILDS_APPROVE,
        ADMIN_PERMISSIONS.BUILDS_REJECT
      ] as AdminPermission[]
    },
    {
      name: 'Themes',
      permissions: [
        ADMIN_PERMISSIONS.THEMES_VIEW,
        ADMIN_PERMISSIONS.THEMES_EDIT,
        ADMIN_PERMISSIONS.THEMES_DELETE
      ] as AdminPermission[]
    },
    {
      name: 'Data',
      permissions: [
        ADMIN_PERMISSIONS.DATA_VIEW,
        ADMIN_PERMISSIONS.DATA_IMPORT
      ] as AdminPermission[]
    },
    {
      name: 'Settings',
      permissions: [
        ADMIN_PERMISSIONS.SETTINGS_VIEW,
        ADMIN_PERMISSIONS.SETTINGS_EDIT
      ] as AdminPermission[]
    }
  ];
}
