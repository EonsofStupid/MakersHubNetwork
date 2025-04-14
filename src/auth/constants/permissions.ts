
// Auth-specific permissions
export const AUTH_PERMISSIONS = {
  ADMIN_ACCESS: 'admin:access',
  VIEW_CONTENT: 'content:view',
  CREATE_CONTENT: 'content:create',
  EDIT_CONTENT: 'content:edit',
  DELETE_CONTENT: 'content:delete',
  VIEW_USERS: 'users:view',
  EDIT_USERS: 'users:edit',
  DELETE_USERS: 'users:delete',
  SYSTEM_VIEW: 'system:view',
  SYSTEM_EDIT: 'system:edit',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  SUPER_ADMIN: 'super:admin',
  ADMIN_EDIT: 'admin:edit' // Added missing permission
} as const;

// Auth permission value type
export type AuthPermissionValue = typeof AUTH_PERMISSIONS[keyof typeof AUTH_PERMISSIONS];

// Re-export for backward compatibility
export const PERMISSIONS = AUTH_PERMISSIONS;
export type PermissionValue = AuthPermissionValue;
