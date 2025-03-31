
/**
 * Admin permission constants
 * Centralized definition of all permission values
 */
export const AdminPermissions = {
  // Core admin permissions
  ADMIN_ACCESS: "admin:access",
  ADMIN_VIEW: "admin:view",
  ADMIN_EDIT: "admin:edit",
  
  // Content permissions
  CONTENT_VIEW: "content:view",
  CONTENT_EDIT: "content:edit",
  CONTENT_DELETE: "content:delete",
  
  // User permissions
  USERS_VIEW: "users:view",
  USERS_EDIT: "users:edit",
  USERS_DELETE: "users:delete",
  
  // Build permissions
  BUILDS_VIEW: "builds:view",
  BUILDS_APPROVE: "builds:approve",
  BUILDS_REJECT: "builds:reject",
  
  // Theme permissions
  THEMES_VIEW: "themes:view",
  THEMES_EDIT: "themes:edit",
  THEMES_DELETE: "themes:delete",
  
  // Data permissions
  DATA_VIEW: "data:view",
  DATA_IMPORT: "data:import",
  
  // Settings permissions
  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",
  
  // Super admin permissions
  SUPER_ADMIN: "super_admin:all"
} as const;

// Define permission value type
export type AdminPermissionValue = typeof AdminPermissions[keyof typeof AdminPermissions];

// For backward compatibility with existing code
export type { AdminPermission } from "../types/admin.types";

// Mapping between permission key and value for easy access
export const permissionMap: Record<string, AdminPermissionValue> = Object.entries(AdminPermissions)
  .reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value
  }), {});

/**
 * Map of section names to their required permissions
 * Used for both navigation and feature access control
 */
export const sectionPermissionMap: Record<string, AdminPermissionValue> = {
  'overview': AdminPermissions.ADMIN_ACCESS,
  'users': AdminPermissions.USERS_VIEW,
  'content': AdminPermissions.CONTENT_VIEW,
  'builds': AdminPermissions.BUILDS_VIEW,
  'data': AdminPermissions.DATA_VIEW,
  'themes': AdminPermissions.THEMES_VIEW,
  'settings': AdminPermissions.SETTINGS_VIEW,
  'analytics': AdminPermissions.ADMIN_ACCESS,
  'permissions': AdminPermissions.SUPER_ADMIN,
  'reviews': AdminPermissions.CONTENT_VIEW
};

/**
 * Get a permission value from the permission constant
 * @param key Key from AdminPermissions object
 * @returns The permission value string
 */
export function getPermissionValue(key: keyof typeof AdminPermissions): AdminPermissionValue {
  return AdminPermissions[key];
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
      ] as AdminPermissionValue[]
    },
    {
      name: 'Content',
      permissions: [
        AdminPermissions.CONTENT_VIEW, 
        AdminPermissions.CONTENT_EDIT, 
        AdminPermissions.CONTENT_DELETE
      ] as AdminPermissionValue[]
    },
    {
      name: 'Users',
      permissions: [
        AdminPermissions.USERS_VIEW, 
        AdminPermissions.USERS_EDIT, 
        AdminPermissions.USERS_DELETE
      ] as AdminPermissionValue[]
    },
    {
      name: 'Builds',
      permissions: [
        AdminPermissions.BUILDS_VIEW, 
        AdminPermissions.BUILDS_APPROVE, 
        AdminPermissions.BUILDS_REJECT
      ] as AdminPermissionValue[]
    },
    {
      name: 'Themes',
      permissions: [
        AdminPermissions.THEMES_VIEW, 
        AdminPermissions.THEMES_EDIT, 
        AdminPermissions.THEMES_DELETE
      ] as AdminPermissionValue[]
    },
    {
      name: 'Data',
      permissions: [
        AdminPermissions.DATA_VIEW, 
        AdminPermissions.DATA_IMPORT
      ] as AdminPermissionValue[]
    },
    {
      name: 'Settings',
      permissions: [
        AdminPermissions.SETTINGS_VIEW, 
        AdminPermissions.SETTINGS_EDIT
      ] as AdminPermissionValue[]
    }
  ];
}
