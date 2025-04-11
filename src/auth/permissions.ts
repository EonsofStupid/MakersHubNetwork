
/**
 * auth/permissions.ts
 * 
 * Define permissions used throughout the application
 */

export type PermissionValue = string;

export const PERMISSIONS = {
  // Content management
  VIEW_CONTENT: 'view:content',
  CREATE_CONTENT: 'create:content',
  EDIT_CONTENT: 'edit:content',
  DELETE_CONTENT: 'delete:content',
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',
  
  // User management
  VIEW_USERS: 'view:users',
  EDIT_USERS: 'edit:users',
  DELETE_USERS: 'delete:users',
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Admin access
  ADMIN_ACCESS: 'admin:access',
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  SUPER_ADMIN: 'admin:super',
  
  // System management
  SYSTEM_VIEW: 'system:view',
  VIEW_SYSTEM: 'system:view', // Alias for backward compatibility
  SYSTEM_EDIT: 'system:edit',
  EDIT_SYSTEM: 'system:edit', // Alias for backward compatibility
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_RESTART: 'system:restart',
  
  // Development tools
  DEV_TOOLS: 'dev:tools',
  
  // Builds
  BUILDS_VIEW: 'builds:view',
  BUILDS_CREATE: 'builds:create',
  BUILDS_EDIT: 'builds:edit',
  BUILDS_APPROVE: 'builds:approve',
  BUILDS_REJECT: 'builds:reject',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // Themes
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  THEMES_DELETE: 'themes:delete',
  
  // Data
  DATA_VIEW: 'data:view',
  DATA_EDIT: 'data:edit',
  DATA_IMPORT: 'data:import',
  DATA_EXPORT: 'data:export',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view'
} as const;

// Export permission values mapping
export const ROLE_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.ADMIN_EDIT,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_EDIT
  ],
  editor: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_CREATE
  ],
  user: [
    PERMISSIONS.CONTENT_VIEW
  ]
} as const;
