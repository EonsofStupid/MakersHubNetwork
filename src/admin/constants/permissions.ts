
// Define all possible admin permissions
export const ADMIN_PERMISSIONS = {
  // General admin access
  VIEW_ADMIN_PANEL: 'admin:view',
  MANAGE_USERS: 'admin:users:manage',
  MANAGE_CONTENT: 'admin:content:manage',
  MANAGE_SETTINGS: 'admin:settings:manage',
  SYSTEM_CRITICAL: 'admin:system:critical',

  // Specific access permissions
  ADMIN_VIEW: 'admin:dashboard:view',
  USERS_VIEW: 'admin:users:view',
  BUILDS_VIEW: 'admin:builds:view',
  CONTENT_VIEW: 'admin:content:view',
  LOGS_VIEW: 'admin:logs:view',
  SETTINGS_VIEW: 'admin:settings:view',
  THEMES_VIEW: 'admin:themes:view',

  // Administrative edit permissions
  USERS_EDIT: 'admin:users:edit',
  CONTENT_EDIT: 'admin:content:edit',
  SETTINGS_EDIT: 'admin:settings:edit',
  THEMES_EDIT: 'admin:themes:edit',
  ADMIN_EDIT: 'admin:dashboard:edit'
};

// Permission groups
export const ADMIN_PERMISSION_GROUPS = {
  ADMIN_FULL: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL,
    ADMIN_PERMISSIONS.MANAGE_USERS,
    ADMIN_PERMISSIONS.MANAGE_CONTENT,
    ADMIN_PERMISSIONS.MANAGE_SETTINGS,
  ],
  
  CONTENT_MANAGER: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL,
    ADMIN_PERMISSIONS.MANAGE_CONTENT,
  ],
};
