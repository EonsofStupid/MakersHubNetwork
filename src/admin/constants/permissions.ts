
export enum ADMIN_PERMISSIONS {
  // Core admin permissions
  ADMIN_VIEW = 'admin:view',
  ADMIN_EDIT = 'admin:edit',
  ADMIN_CREATE = 'admin:create',
  ADMIN_DELETE = 'admin:delete',
  
  // Content management
  CONTENT_VIEW = 'content:view',
  CONTENT_EDIT = 'content:edit',
  CONTENT_CREATE = 'content:create',
  CONTENT_DELETE = 'content:delete',
  
  // User management
  USERS_VIEW = 'users:view',
  USERS_EDIT = 'users:edit',
  USERS_CREATE = 'users:create',
  USERS_DELETE = 'users:delete',
  
  // Builds management
  BUILDS_VIEW = 'builds:view',
  BUILDS_EDIT = 'builds:edit',
  BUILDS_CREATE = 'builds:create',
  BUILDS_DELETE = 'builds:delete',
  
  // Settings and configuration
  SETTINGS_VIEW = 'settings:view',
  SETTINGS_EDIT = 'settings:edit',
  
  // Themes
  THEMES_VIEW = 'themes:view',
  THEMES_EDIT = 'themes:edit',
  
  // System operations
  SYSTEM_LOGS = 'system:logs',
  SYSTEM_SETTINGS = 'system:settings'
}

// Map roles to permissions
export const ROLE_PERMISSIONS = {
  'super_admin': Object.values(ADMIN_PERMISSIONS),
  'admin': [
    ADMIN_PERMISSIONS.ADMIN_VIEW,
    ADMIN_PERMISSIONS.CONTENT_VIEW,
    ADMIN_PERMISSIONS.CONTENT_EDIT,
    ADMIN_PERMISSIONS.USERS_VIEW,
    ADMIN_PERMISSIONS.BUILDS_VIEW,
    ADMIN_PERMISSIONS.BUILDS_EDIT,
    ADMIN_PERMISSIONS.SETTINGS_VIEW,
    ADMIN_PERMISSIONS.THEMES_VIEW,
    ADMIN_PERMISSIONS.SYSTEM_LOGS
  ],
  'user': []
};
