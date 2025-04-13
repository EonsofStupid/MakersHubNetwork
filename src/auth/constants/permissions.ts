// Permission constants in UPPER_SNAKE case
export const AUTH_PERMISSIONS = {
  ADMIN_ACCESS: 'admin:access',
  VIEW_CONTENT: 'content:view',
  CREATE_CONTENT: 'content:create',
  EDIT_CONTENT: 'content:edit',
  DELETE_CONTENT: 'content:delete',
  VIEW_USERS: 'users:view',
  EDIT_USERS: 'users:edit',
  SYSTEM_VIEW: 'system:view',
  SUPER_ADMIN: 'super:admin'
} as const;

// Permission value type
export type AuthPermissionValue = typeof AUTH_PERMISSIONS[keyof typeof AUTH_PERMISSIONS];

// Re-export for backward compatibility
export const PERMISSIONS = AUTH_PERMISSIONS;
export type PermissionValue = AuthPermissionValue;
