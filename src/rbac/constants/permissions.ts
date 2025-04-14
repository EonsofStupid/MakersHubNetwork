/**
 * RBAC Permission Definitions
 * Central source of truth for permission definitions in the application
 */

// Define all possible permissions
export enum Permission {
  // Content permissions
  CONTENT_VIEW = 'content:view',
  CONTENT_CREATE = 'content:create',
  CONTENT_EDIT = 'content:edit',
  CONTENT_DELETE = 'content:delete',
  
  // User permissions
  USER_VIEW = 'user:view',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',
  
  // Admin permissions
  ADMIN_ACCESS = 'admin:access',
  ADMIN_VIEW = 'admin:view',
  ADMIN_EDIT = 'admin:edit',
  ADMIN_DELETE = 'admin:delete',
  
  // System permissions
  SYSTEM_VIEW = 'system:view',
  SYSTEM_EDIT = 'system:edit',
  
  // Settings permissions
  SETTINGS_VIEW = 'settings:view',
  SETTINGS_EDIT = 'settings:edit',
  
  // Project permissions
  PROJECT_CREATE = 'create_project',
  PROJECT_EDIT = 'edit_project',
  PROJECT_DELETE = 'delete_project',
  PROJECT_SUBMIT = 'submit_build',
  
  // API permissions
  API_KEY_MANAGE = 'manage_api_keys',
  
  // Other permissions
  VIEW_ANALYTICS = 'view_analytics'
}

// Default empty permissions object - for initialization
export const DEFAULT_PERMISSIONS: Record<Permission, boolean> = Object.values(Permission).reduce(
  (acc, permission) => ({ ...acc, [permission]: false }), 
  {} as Record<Permission, boolean>
);
