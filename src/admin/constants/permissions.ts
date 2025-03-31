
export type AdminPermissionValue = string;

export const AdminPermissions = {
  // Super admin has all permissions
  SUPER_ADMIN: 'super_admin:all',
  
  // Basic admin access
  ADMIN_ACCESS: 'admin:access',
  ADMIN_VIEW: 'admin:view',
  ADMIN_EDIT: 'admin:edit',
  
  // User management permissions
  USERS_VIEW: 'users:view',
  USERS_EDIT: 'users:edit',
  USERS_CREATE: 'users:create',
  USERS_DELETE: 'users:delete',
  
  // Content management permissions
  CONTENT_VIEW: 'content:view',
  CONTENT_EDIT: 'content:edit',
  CONTENT_CREATE: 'content:create',
  CONTENT_DELETE: 'content:delete',
  
  // Data permissions
  DATA_VIEW: 'data:view',
  DATA_EDIT: 'data:edit',
  
  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  
  // Settings permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // Theme permissions
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  
  // Layout permissions
  LAYOUTS_VIEW: 'layouts:view',
  LAYOUTS_EDIT: 'layouts:edit',
  
  // Build permissions
  BUILDS_VIEW: 'builds:view',
  BUILDS_EDIT: 'builds:edit',
  BUILDS_APPROVE: 'builds:approve',
  
  // Workflow permissions
  WORKFLOWS_VIEW: 'workflows:view',
  WORKFLOWS_EDIT: 'workflows:edit',
  
  // Review permissions
  REVIEWS_VIEW: 'reviews:view',
  REVIEWS_MANAGE: 'reviews:manage',
  
  // Messaging permissions
  MESSAGING_ACCESS: 'messaging:access',
  MESSAGING_MANAGE: 'messaging:manage',
} as const;
