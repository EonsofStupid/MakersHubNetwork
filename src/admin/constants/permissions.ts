
// Define admin permissions as a type-safe object
export const ADMIN_PERMISSIONS = {
  // Super admin has access to everything
  SUPER_ADMIN: 'all:all',
  
  // General admin access
  ADMIN_ACCESS: 'admin:access',
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  
  // Content management
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',
  
  // User management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Build management
  BUILDS_VIEW: 'builds:view',
  BUILDS_APPROVE: 'builds:approve',
  BUILDS_REJECT: 'builds:reject',
  BUILDS_EDIT: 'builds:edit',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  
  // Theme management
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  THEMES_DELETE: 'themes:delete',
  
  // Data management
  DATA_VIEW: 'data:view',
  DATA_EDIT: 'data:edit',
  DATA_IMPORT: 'data:import',
  DATA_EXPORT: 'data:export',
  
  // Reviews management
  REVIEWS_VIEW: 'reviews:view',
  REVIEWS_APPROVE: 'reviews:approve',
  REVIEWS_REJECT: 'reviews:reject',
  
  // System management
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_RESTART: 'system:restart'
} as const;

// Create a type from the values in the ADMIN_PERMISSIONS object
export type AdminPermissionValue = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];

// Type for permissions check functions
export type PermissionCheckFn = (permission: AdminPermissionValue) => boolean;
