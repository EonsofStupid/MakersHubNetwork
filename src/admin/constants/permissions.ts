
/**
 * Admin permission constants
 *
 * Defines all available permissions for the admin section
 */
export const ADMIN_PERMISSIONS = {
  // Core permissions
  VIEW_ADMIN_PANEL: 'view_admin_panel',
  MANAGE_USERS: 'manage_users',
  MANAGE_CONTENT: 'manage_content',
  MANAGE_SETTINGS: 'manage_settings',
  SYSTEM_CRITICAL: 'system_critical',
  
  // Extended permissions for admin views
  ADMIN_VIEW: 'admin_view',
  USERS_VIEW: 'users_view',
  BUILDS_VIEW: 'builds_view',
  CONTENT_VIEW: 'content_view',
  THEMES_VIEW: 'themes_view',
  ANALYTICS_VIEW: 'analytics_view',
  SYSTEM_LOGS: 'system_logs_view',
  SYSTEM_SETTINGS: 'system_settings_view',
  SETTINGS_VIEW: 'settings_view',
  DATA_VIEW: 'data_view',
  
  // Permission for admin editing mode
  ADMIN_EDIT: 'admin_edit',
};

// Permission groups - useful for checking multiple related permissions
export const PERMISSION_GROUPS = {
  BASIC_ADMIN: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL,
    ADMIN_PERMISSIONS.ADMIN_VIEW
  ],
  CONTENT_MANAGER: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL,
    ADMIN_PERMISSIONS.MANAGE_CONTENT,
    ADMIN_PERMISSIONS.CONTENT_VIEW
  ],
  USER_MANAGER: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL,
    ADMIN_PERMISSIONS.MANAGE_USERS,
    ADMIN_PERMISSIONS.USERS_VIEW
  ],
  SYSTEM_ADMIN: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL,
    ADMIN_PERMISSIONS.MANAGE_SETTINGS,
    ADMIN_PERMISSIONS.SYSTEM_SETTINGS,
    ADMIN_PERMISSIONS.SETTINGS_VIEW,
    ADMIN_PERMISSIONS.SYSTEM_LOGS
  ],
};

// Map user roles to allowed permissions
export const ROLE_PERMISSIONS = {
  'user': [],
  'admin': [
    ...PERMISSION_GROUPS.BASIC_ADMIN,
    ...PERMISSION_GROUPS.CONTENT_MANAGER,
    ...PERMISSION_GROUPS.USER_MANAGER,
  ],
  'super_admin': [
    ...PERMISSION_GROUPS.BASIC_ADMIN,
    ...PERMISSION_GROUPS.CONTENT_MANAGER,
    ...PERMISSION_GROUPS.USER_MANAGER,
    ...PERMISSION_GROUPS.SYSTEM_ADMIN,
    ADMIN_PERMISSIONS.SYSTEM_CRITICAL,
    ADMIN_PERMISSIONS.ADMIN_EDIT,
    ADMIN_PERMISSIONS.THEMES_VIEW,
    ADMIN_PERMISSIONS.ANALYTICS_VIEW,
    ADMIN_PERMISSIONS.DATA_VIEW,
    ADMIN_PERMISSIONS.BUILDS_VIEW,
  ]
};
