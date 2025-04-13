
// Admin-specific permissions
export const ADMIN_PERMISSIONS = {
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  ADMIN_DELETE: 'admin:delete',
  USER_VIEW: 'user:view',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  CONTENT_VIEW: 'content:view',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit'
} as const;

// Admin permission value type
export type AdminPermissionValue = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];
