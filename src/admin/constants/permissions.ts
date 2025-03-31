
export type AdminPermissionValue = 
  | 'admin:access'
  | 'admin:view'
  | 'admin:edit'
  | 'admin:manage'
  | 'super_admin:all'
  | 'content:view'
  | 'content:edit'
  | 'content:publish'
  | 'users:view'
  | 'users:edit'
  | 'users:delete'
  | 'builds:view'
  | 'builds:edit'
  | 'builds:approve'
  | 'builds:delete'
  | 'reviews:view'
  | 'reviews:edit'
  | 'reviews:moderate'
  | 'settings:view'
  | 'settings:edit'
  | 'themes:view'
  | 'themes:edit'
  | 'data:view'
  | 'data:import'
  | 'analytics:view'
  | 'messaging:access'
  | 'layouts:view'
  | 'workflows:view'
  | 'reviews:manage';

export const ADMIN_PERMISSIONS: Record<string, AdminPermissionValue> = {
  ADMIN_ACCESS: 'admin:access',
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  ADMIN_MANAGE: 'admin:manage',
  SUPER_ADMIN: 'super_admin:all',
  CONTENT_VIEW: 'content:view',
  CONTENT_EDIT: 'content:edit',
  CONTENT_PUBLISH: 'content:publish',
  USERS_VIEW: 'users:view',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  BUILDS_VIEW: 'builds:view',
  BUILDS_EDIT: 'builds:edit',
  BUILDS_APPROVE: 'builds:approve',
  BUILDS_DELETE: 'builds:delete',
  REVIEWS_VIEW: 'reviews:view',
  REVIEWS_EDIT: 'reviews:edit',
  REVIEWS_MODERATE: 'reviews:moderate',
  REVIEWS_MANAGE: 'reviews:manage',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  DATA_VIEW: 'data:view',
  DATA_IMPORT: 'data:import',
  ANALYTICS_VIEW: 'analytics:view',
  MESSAGING_ACCESS: 'messaging:access',
  LAYOUTS_VIEW: 'layouts:view',
  WORKFLOWS_VIEW: 'workflows:view'
};

// Alias to maintain backward compatibility
export const AdminPermissions = ADMIN_PERMISSIONS;
