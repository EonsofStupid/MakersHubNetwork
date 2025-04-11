
/**
 * Permissions for the admin panel
 */
export const ADMIN_PERMISSIONS = {
  // Access permissions
  ACCESS: 'admin:access',
  ADMIN_ACCESS: 'admin:access',

  // User management
  USERS_READ: 'admin:users:read',
  USERS_WRITE: 'admin:users:write',
  USERS_VIEW: 'admin:users:view',

  // Theme management
  THEMES_READ: 'admin:themes:read',
  THEMES_WRITE: 'admin:themes:write',
  THEMES_VIEW: 'admin:themes:view',

  // Layout management
  LAYOUTS_READ: 'admin:layouts:read',
  LAYOUTS_WRITE: 'admin:layouts:write',

  // Content management
  CONTENT_READ: 'admin:content:read',
  CONTENT_WRITE: 'admin:content:write',
  CONTENT_VIEW: 'admin:content:view',

  // Setting management
  SETTINGS_READ: 'admin:settings:read',
  SETTINGS_WRITE: 'admin:settings:write',
  SETTINGS_VIEW: 'admin:settings:view',

  // Analytics
  ANALYTICS_VIEW: 'admin:analytics:view',

  // System
  SYSTEM_VIEW: 'admin:system:view',
  SYSTEM_EDIT: 'admin:system:edit',
  SYSTEM_LOGS: 'admin:system:logs',
  SYSTEM_SETTINGS: 'admin:system:settings',
  SYSTEM_WRITE: 'admin:system:write',

  // Build management
  BUILDS_VIEW: 'admin:builds:view',

  // Admin roles
  ADMIN_VIEW: 'admin:roles:view',
  ADMIN_EDIT: 'admin:roles:edit',
};

export type AdminPermissionValue = keyof typeof ADMIN_PERMISSIONS;
