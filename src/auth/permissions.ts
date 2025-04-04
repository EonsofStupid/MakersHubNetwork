
/**
 * Type for permission values
 */
export type PermissionValue = 
  | `role:${string}` 
  | `${string}:*` 
  | `${string}:${string}` 
  | string;

/**
 * Admin permissions enum
 */
export enum AdminPermission {
  ADMIN_VIEW = 'admin:view',
  ADMIN_EDIT = 'admin:edit',
  ADMIN_CREATE = 'admin:create',
  ADMIN_DELETE = 'admin:delete',
  ADMIN_SETTINGS = 'admin:settings',
  ADMIN_USERS = 'admin:users',
  ADMIN_CONTENT = 'admin:content',
  ADMIN_LAYOUTS = 'admin:layouts',
  ADMIN_THEME = 'admin:theme',
  ADMIN_ALL = 'admin:*'
}

/**
 * Permissions constants used throughout the application
 */
export const PERMISSIONS = {
  // Admin access
  ADMIN_ACCESS: 'admin:access',
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  
  // User management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Content management
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',
  
  // Build management
  BUILDS_VIEW: 'builds:view',
  BUILDS_CREATE: 'builds:create',
  BUILDS_EDIT: 'builds:edit', 
  BUILDS_APPROVE: 'builds:approve',
  BUILDS_REJECT: 'builds:reject',
  
  // Theme management
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  THEMES_DELETE: 'themes:delete',
  
  // Data management
  DATA_VIEW: 'data:view',
  DATA_EDIT: 'data:edit',
  DATA_IMPORT: 'data:import',
  DATA_EXPORT: 'data:export',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  
  // Settings management
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // System management
  SYSTEM_VIEW: 'system:view',
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_RESTART: 'system:restart',
  
  // Super admin
  SUPER_ADMIN: 'super:admin'
};

/**
 * Map roles to permissions
 */
export const ROLE_PERMISSIONS = {
  super_admin: [PERMISSIONS.SUPER_ADMIN],
  admin: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.ADMIN_EDIT,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.THEMES_VIEW,
    PERMISSIONS.THEMES_EDIT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.SYSTEM_VIEW
  ],
  moderator: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_PUBLISH
  ],
  editor: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT
  ],
  user: []
};
