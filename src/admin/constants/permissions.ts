
// Define admin-specific permissions
export const ADMIN_PERMISSIONS = {
  // Access permissions
  ACCESS: 'admin:access',
  ADMIN_ACCESS: 'admin:full-access',
  
  // User profile permissions
  USER_PROFILE_READ: 'user-profile:read',
  USER_PROFILE_WRITE: 'user-profile:write',
  
  // User management permissions
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_VIEW: 'users:view',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Theme permissions
  THEMES_READ: 'themes:read',
  THEMES_WRITE: 'themes:write',
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  THEMES_DELETE: 'themes:delete',
  
  // Layout permissions
  LAYOUTS_READ: 'layouts:read',
  LAYOUTS_WRITE: 'layouts:write',
  
  // Settings permissions
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // Content permissions
  CONTENT_READ: 'content:read',
  CONTENT_WRITE: 'content:write',
  CONTENT_VIEW: 'content:view',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  
  // Build permissions
  BUILDS_READ: 'builds:read',
  BUILDS_WRITE: 'builds:write',
  BUILDS_VIEW: 'builds:view',
  BUILDS_APPROVE: 'builds:approve',
  BUILDS_REJECT: 'builds:reject',
  
  // Data permissions
  DATA_READ: 'data:read',
  DATA_WRITE: 'data:write',
  DATA_VIEW: 'data:view',
  DATA_IMPORT: 'data:import',
  
  // System permissions
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_WRITE: 'system:write',
  
  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  
  // Super admin permission
  SUPER_ADMIN: 'admin:super',
  
  // Admin mode permissions
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
};
