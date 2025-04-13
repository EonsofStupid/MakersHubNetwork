
/**
 * Admin permission constants
 * Used for checking admin-specific permissions across the application
 */
export const ADMIN_PERMISSIONS = {
  // General admin access
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  
  // Content management
  CONTENT_VIEW: 'content:view',
  CONTENT_EDIT: 'content:edit',
  CONTENT_CREATE: 'content:create',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',
  
  // User management
  USER_VIEW: 'user:view',
  USER_EDIT: 'user:edit',
  USER_CREATE: 'user:create',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',
  
  // System settings
  SYSTEM_VIEW: 'system:view',
  SYSTEM_EDIT: 'system:edit',
  SYSTEM_SETTINGS: 'system:settings',
  
  // Builds & reviews
  BUILDS_APPROVE: 'builds:approve',
  BUILDS_REJECT: 'builds:reject',
  
  // Layout management
  LAYOUT_EDIT: 'layout:edit',
  LAYOUT_CREATE: 'layout:create',
  LAYOUT_DELETE: 'layout:delete',
  
  // Theme management
  THEME_EDIT: 'theme:edit',
  THEME_CREATE: 'theme:create',
  THEME_DELETE: 'theme:delete',
  
  // Debug tools
  DEBUG_VIEW: 'debug:view',
  DEBUG_USE: 'debug:use'
};
