
/**
 * Auth permission constants
 */
export const AUTH_PERMISSIONS = {
  // Access permissions
  ADMIN_ACCESS: 'admin:access',
  
  // Content management
  VIEW_CONTENT: 'content:view',
  CREATE_CONTENT: 'content:create',
  EDIT_CONTENT: 'content:edit',
  DELETE_CONTENT: 'content:delete',
  
  // User management
  VIEW_USERS: 'users:view',
  EDIT_USERS: 'users:edit',
  DELETE_USERS: 'users:delete',
  
  // System management
  SYSTEM_VIEW: 'system:view',
  SYSTEM_EDIT: 'system:edit',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // Super admin permission
  SUPER_ADMIN: 'super:admin',
} as const;

// Permission value type
export type AuthPermissionValue = typeof AUTH_PERMISSIONS[keyof typeof AUTH_PERMISSIONS];

// Permission map type
export type PermissionMap = Record<AuthPermissionValue, boolean>;

// Export PERMISSIONS for backward compatibility
export const PERMISSIONS = AUTH_PERMISSIONS;
export type PermissionValue = AuthPermissionValue;
