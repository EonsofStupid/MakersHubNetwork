
// Define all admin permissions as constants
export const ADMIN_PERMISSIONS = {
  // Super admin permission that grants all access
  SUPER_ADMIN: 'all:all',
  
  // Basic admin access
  ADMIN_ACCESS: 'admin:access',
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  
  // Content management
  CONTENT_VIEW: 'content:view',
  CONTENT_EDIT: 'content:edit',
  CONTENT_PUBLISH: 'content:publish',
  CONTENT_DELETE: 'content:delete',
  
  // User management
  USERS_VIEW: 'users:view',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Build management
  BUILDS_VIEW: 'builds:view',
  BUILDS_EDIT: 'builds:edit',
  BUILDS_DELETE: 'builds:delete',
  BUILDS_APPROVE: 'builds:approve',
  
  // Review management
  REVIEWS_VIEW: 'reviews:view',
  REVIEWS_EDIT: 'reviews:edit',
  REVIEWS_DELETE: 'reviews:delete',
  REVIEWS_APPROVE: 'reviews:approve',
  
  // Theme management
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  THEMES_PUBLISH: 'themes:publish',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // API management
  API_KEYS_VIEW: 'api_keys:view',
  API_KEYS_EDIT: 'api_keys:edit',
  
  // System management
  SYSTEM_VIEW: 'system:view',
  SYSTEM_EDIT: 'system:edit',
  SYSTEM_RESTART: 'system:restart',
} as const;

export type AdminPermissionValue = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];

export const PERMISSION_GROUPS = {
  CONTENT: [
    ADMIN_PERMISSIONS.CONTENT_VIEW,
    ADMIN_PERMISSIONS.CONTENT_EDIT,
    ADMIN_PERMISSIONS.CONTENT_PUBLISH,
    ADMIN_PERMISSIONS.CONTENT_DELETE,
  ],
  USERS: [
    ADMIN_PERMISSIONS.USERS_VIEW,
    ADMIN_PERMISSIONS.USERS_EDIT,
    ADMIN_PERMISSIONS.USERS_DELETE,
  ],
  BUILDS: [
    ADMIN_PERMISSIONS.BUILDS_VIEW,
    ADMIN_PERMISSIONS.BUILDS_EDIT,
    ADMIN_PERMISSIONS.BUILDS_DELETE,
    ADMIN_PERMISSIONS.BUILDS_APPROVE,
  ],
  REVIEWS: [
    ADMIN_PERMISSIONS.REVIEWS_VIEW,
    ADMIN_PERMISSIONS.REVIEWS_EDIT,
    ADMIN_PERMISSIONS.REVIEWS_DELETE,
    ADMIN_PERMISSIONS.REVIEWS_APPROVE,
  ],
  THEMES: [
    ADMIN_PERMISSIONS.THEMES_VIEW,
    ADMIN_PERMISSIONS.THEMES_EDIT,
    ADMIN_PERMISSIONS.THEMES_PUBLISH,
  ],
  SETTINGS: [
    ADMIN_PERMISSIONS.SETTINGS_VIEW,
    ADMIN_PERMISSIONS.SETTINGS_EDIT,
  ],
  API_KEYS: [
    ADMIN_PERMISSIONS.API_KEYS_VIEW,
    ADMIN_PERMISSIONS.API_KEYS_EDIT,
  ],
  SYSTEM: [
    ADMIN_PERMISSIONS.SYSTEM_VIEW,
    ADMIN_PERMISSIONS.SYSTEM_EDIT,
    ADMIN_PERMISSIONS.SYSTEM_RESTART,
  ],
};
