
export type AdminPermissionValue = string;

export const ADMIN_PERMISSIONS = {
  // Base access permission
  ACCESS: 'admin.access',
  
  // User management
  USERS_READ: 'admin.users.read',
  USERS_WRITE: 'admin.users.write',
  
  // Theme management
  THEMES_READ: 'admin.themes.read',
  THEMES_WRITE: 'admin.themes.write',
  
  // Layout management
  LAYOUTS_READ: 'admin.layouts.read',
  LAYOUTS_WRITE: 'admin.layouts.write',
  
  // Content management
  CONTENT_READ: 'admin.content.read',
  CONTENT_WRITE: 'admin.content.write',
  
  // System management
  SYSTEM_READ: 'admin.system.read',
  SYSTEM_WRITE: 'admin.system.write',

  // Additional view permissions for compatibility with existing code
  ADMIN_VIEW: 'admin.access',
  USERS_VIEW: 'admin.users.read',
  BUILDS_VIEW: 'admin.builds.read',
  CONTENT_VIEW: 'admin.content.read',
  THEMES_VIEW: 'admin.themes.read',
  SETTINGS_VIEW: 'admin.settings.read',
  SYSTEM_SETTINGS: 'admin.system.write',
  SYSTEM_LOGS: 'admin.system.read',
  DATA_VIEW: 'admin.data.read',
  ANALYTICS_VIEW: 'admin.analytics.read',
  ADMIN_EDIT: 'admin.edit'
};
