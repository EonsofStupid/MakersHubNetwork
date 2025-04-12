
/**
 * Admin permissions constants
 * 
 * These are the permissions used throughout the admin interface.
 * Each permission follows the format of {action}:{resource}
 * 
 * This centralized list ensures consistency across the application.
 */
export const ADMIN_PERMISSIONS = {
  // Core permissions
  VIEW_ADMIN_PANEL: 'view:admin_panel',
  MANAGE_USERS: 'manage:users',
  MANAGE_CONTENT: 'manage:content',
  MANAGE_SETTINGS: 'manage:settings',
  SYSTEM_CRITICAL: 'manage:system',

  // Granular view permissions
  ADMIN_VIEW: 'view:admin',
  USERS_VIEW: 'view:users',
  BUILDS_VIEW: 'view:builds',
  CONTENT_VIEW: 'view:content',
  SETTINGS_VIEW: 'view:settings',
  THEMES_VIEW: 'view:themes',
  LOGS_VIEW: 'view:logs',
  ANALYTICS_VIEW: 'view:analytics',
  DATA_VIEW: 'view:data',
  ROLES_VIEW: 'view:roles',
  
  // Granular edit permissions
  USERS_EDIT: 'edit:users',
  CONTENT_EDIT: 'edit:content',
  SETTINGS_EDIT: 'edit:settings',
  THEMES_EDIT: 'edit:themes',
  ROLES_EDIT: 'edit:roles',
  ADMIN_EDIT: 'edit:admin',
};
