
// Define permission values
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
  BUILDS_REJECT: 'builds:reject', // Added the missing permission
  
  // Theme management
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  THEMES_DELETE: 'themes:delete',
  
  // Parts management
  PARTS_VIEW: 'parts:view',
  PARTS_CREATE: 'parts:create',
  PARTS_EDIT: 'parts:edit',
  PARTS_DELETE: 'parts:delete',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // System
  SYSTEM_VIEW: 'system:view',
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_RESTART: 'system:restart',
  
  // Data
  DATA_VIEW: 'data:view',
  DATA_EDIT: 'data:edit',
  DATA_IMPORT: 'data:import',
  DATA_EXPORT: 'data:export',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  
  // Super admin (has all permissions)
  SUPER_ADMIN: 'super:admin'
} as const;

export type PermissionValue = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Define role-based permissions
export const ROLE_PERMISSIONS: Record<string, PermissionValue[]> = {
  super_admin: [PERMISSIONS.SUPER_ADMIN],
  admin: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.ADMIN_EDIT,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.BUILDS_VIEW,
    PERMISSIONS.BUILDS_APPROVE,
    PERMISSIONS.THEMES_VIEW,
    PERMISSIONS.THEMES_EDIT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.SYSTEM_VIEW,
    PERMISSIONS.SYSTEM_LOGS,
    PERMISSIONS.DATA_VIEW,
    PERMISSIONS.DATA_EXPORT
  ],
  moderator: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.BUILDS_VIEW,
    PERMISSIONS.BUILDS_APPROVE,
    PERMISSIONS.SYSTEM_LOGS
  ],
  maker: [
    PERMISSIONS.PARTS_VIEW,
    PERMISSIONS.PARTS_CREATE,
    PERMISSIONS.PARTS_EDIT,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE
  ],
  builder: [
    PERMISSIONS.PARTS_VIEW,
    PERMISSIONS.BUILDS_VIEW,
    PERMISSIONS.BUILDS_CREATE,
    PERMISSIONS.BUILDS_EDIT,
    PERMISSIONS.CONTENT_VIEW
  ],
  user: [
    PERMISSIONS.PARTS_VIEW,
    PERMISSIONS.BUILDS_VIEW,
    PERMISSIONS.CONTENT_VIEW
  ],
  editor: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_PUBLISH
  ]
};
