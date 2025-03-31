
import { AdminPermission } from "@/admin/types/admin.types";
import { AdminPermissions } from "@/admin/constants/permissions";

/**
 * Map section names to their required permissions
 * Used for both navigation and feature access control
 */
export const sectionPermissionMap: Record<string, AdminPermission> = {
  'overview': AdminPermissions.ADMIN_ACCESS,
  'users': AdminPermissions.USERS_VIEW,
  'content': AdminPermissions.CONTENT_VIEW,
  'builds': AdminPermissions.BUILDS_VIEW,
  'data': AdminPermissions.DATA_VIEW,
  'themes': AdminPermissions.THEMES_VIEW,
  'settings': AdminPermissions.SETTINGS_VIEW,
  'analytics': AdminPermissions.ADMIN_ACCESS
};

/**
 * Check if the specified permissions include admin access
 * @param permissions Array of permissions to check
 */
export function hasAdminAccess(permissions: AdminPermission[]): boolean {
  return permissions.some(p => 
    p === AdminPermissions.ADMIN_ACCESS || 
    p === AdminPermissions.ADMIN_VIEW || 
    p === AdminPermissions.SUPER_ADMIN
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
        AdminPermissions.ADMIN_ACCESS,
        AdminPermissions.ADMIN_VIEW,
        AdminPermissions.ADMIN_EDIT
      ] as AdminPermission[]
    },
    {
      name: 'Content',
      permissions: [
        AdminPermissions.CONTENT_VIEW,
        AdminPermissions.CONTENT_EDIT,
        AdminPermissions.CONTENT_DELETE
      ] as AdminPermission[]
    },
    {
      name: 'Users',
      permissions: [
        AdminPermissions.USERS_VIEW,
        AdminPermissions.USERS_EDIT,
        AdminPermissions.USERS_DELETE
      ] as AdminPermission[]
    },
    {
      name: 'Builds',
      permissions: [
        AdminPermissions.BUILDS_VIEW,
        AdminPermissions.BUILDS_APPROVE,
        AdminPermissions.BUILDS_REJECT
      ] as AdminPermission[]
    },
    {
      name: 'Themes',
      permissions: [
        AdminPermissions.THEMES_VIEW,
        AdminPermissions.THEMES_EDIT,
        AdminPermissions.THEMES_DELETE
      ] as AdminPermission[]
    },
    {
      name: 'Data',
      permissions: [
        AdminPermissions.DATA_VIEW,
        AdminPermissions.DATA_IMPORT
      ] as AdminPermission[]
    },
    {
      name: 'Settings',
      permissions: [
        AdminPermissions.SETTINGS_VIEW,
        AdminPermissions.SETTINGS_EDIT
      ] as AdminPermission[]
    }
  ];
}
