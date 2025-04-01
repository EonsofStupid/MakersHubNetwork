
/**
 * Unified Permissions System
 * Single source of truth for all permission values used throughout the application
 */

// Define all permissions as a type-safe object
export const PERMISSIONS = {
  // Super admin has access to everything
  SUPER_ADMIN: 'all:all',
  
  // General admin access
  ADMIN_ACCESS: 'admin:access',
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  ADMIN_CREATE: 'admin:create',
  ADMIN_DELETE: 'admin:delete',
  
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
  BUILDS_CREATE: 'builds:create',
  BUILDS_EDIT: 'builds:edit',
  BUILDS_DELETE: 'builds:delete',
  BUILDS_APPROVE: 'builds:approve',
  BUILDS_REJECT: 'builds:reject',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  
  // Layout management 
  LAYOUTS_VIEW: 'layouts:view',
  LAYOUTS_EDIT: 'layouts:edit',
  
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
  
  // Settings management
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // System management
  SYSTEM_VIEW: 'system:view',
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_RESTART: 'system:restart'
} as const;

// Create permission value type from the PERMISSIONS object
export type PermissionValue = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Map roles to permissions
export const ROLE_PERMISSIONS: Record<string, PermissionValue[]> = {
  'super_admin': [PERMISSIONS.SUPER_ADMIN],
  'admin': [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.ADMIN_EDIT,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.BUILDS_VIEW,
    PERMISSIONS.BUILDS_APPROVE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.THEMES_VIEW,
    PERMISSIONS.SYSTEM_LOGS
  ],
  'maker': [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.BUILDS_VIEW
  ],
  'builder': [
    PERMISSIONS.BUILDS_VIEW,
    PERMISSIONS.BUILDS_CREATE,
    PERMISSIONS.CONTENT_VIEW
  ]
};

// Permission check function type
export type PermissionCheckFn = (permission: PermissionValue) => boolean;
