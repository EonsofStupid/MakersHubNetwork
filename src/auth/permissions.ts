
/**
 * auth/permissions.ts
 * 
 * Define permissions used throughout the application
 */

export type PermissionValue = string;

export const PERMISSIONS = {
  // Content management
  CONTENT: {
    VIEW: 'content:view',
    CREATE: 'content:create',
    EDIT: 'content:edit',
    DELETE: 'content:delete',
    PUBLISH: 'content:publish',
  },
  
  // User management
  USERS: {
    VIEW: 'users:view',
    CREATE: 'users:create',
    EDIT: 'users:edit',
    DELETE: 'users:delete',
  },
  
  // Admin access
  ADMIN: {
    ACCESS: 'admin:access',
    VIEW: 'admin:view',
    EDIT: 'admin:edit',
    SUPER: 'admin:super',
  },
  
  // System management
  SYSTEM: {
    VIEW: 'system:view',
    EDIT: 'system:edit',
    SETTINGS: 'system:settings',
    LOGS: 'system:logs',
    RESTART: 'system:restart',
    DEBUG: 'system:debug',
  },
  
  // Settings
  SETTINGS: {
    VIEW: 'settings:view',
    EDIT: 'settings:edit',
  },
  
  // Analytics
  ANALYTICS: {
    VIEW: 'analytics:view'
  },

  // Legacy flat permissions (for backward compatibility)
  VIEW_CONTENT: 'view:content',
  CREATE_CONTENT: 'create:content',
  EDIT_CONTENT: 'edit:content',
  DELETE_CONTENT: 'delete:content',
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',
  VIEW_USERS: 'view:users',
  EDIT_USERS: 'edit:users',
  DELETE_USERS: 'delete:users',
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  ADMIN_ACCESS: 'admin:access',
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  SUPER_ADMIN: 'admin:super',
  SYSTEM_VIEW: 'system:view',
  VIEW_SYSTEM: 'system:view',
  SYSTEM_EDIT: 'system:edit',
  EDIT_SYSTEM: 'system:edit',
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_RESTART: 'system:restart',
  DEV_TOOLS: 'dev:tools',
  BUILDS_VIEW: 'builds:view',
  BUILDS_CREATE: 'builds:create',
  BUILDS_EDIT: 'builds:edit',
  BUILDS_APPROVE: 'builds:approve',
  BUILDS_REJECT: 'builds:reject',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  THEMES_DELETE: 'themes:delete',
  DATA_VIEW: 'data:view',
  DATA_EDIT: 'data:edit',
  DATA_IMPORT: 'data:import',
  DATA_EXPORT: 'data:export',
  ANALYTICS_VIEW: 'analytics:view'
} as const;
