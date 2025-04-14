
/**
 * Core permission definitions
 * Single source of truth for permission types in the application
 */
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
  PROJECT_CREATE = 'project:create',
  PROJECT_EDIT = 'project:edit',
  PROJECT_DELETE = 'project:delete',
  PROJECT_SUBMIT = 'project:submit',
  PROJECT_VIEW = 'project:view',
  
  // API permissions
  API_KEY_MANAGE = 'api:keys:manage',
  
  // Analytics permissions
  ANALYTICS_VIEW = 'analytics:view'
}

// Export values array for dev tools and iteration
export const PERMISSION_VALUES = Object.values(Permission);

// Default permissions state - all false
export const DEFAULT_PERMISSIONS: Record<Permission, boolean> = 
  Object.values(Permission).reduce(
    (acc, permission) => ({ ...acc, [permission]: false }), 
    {} as Record<Permission, boolean>
  );

// Permission mapping to roles
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: Object.values(Permission),
  admin: [
    Permission.ADMIN_ACCESS,
    Permission.ADMIN_VIEW,
    Permission.ADMIN_EDIT,
    Permission.CONTENT_VIEW,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_EDIT,
    Permission.USER_VIEW,
    Permission.USER_EDIT,
    Permission.SYSTEM_VIEW,
    Permission.SETTINGS_VIEW,
    Permission.PROJECT_VIEW,
    Permission.PROJECT_EDIT,
    Permission.ANALYTICS_VIEW
  ],
  moderator: [
    Permission.CONTENT_VIEW,
    Permission.CONTENT_EDIT,
    Permission.USER_VIEW
  ],
  builder: [
    Permission.PROJECT_CREATE,
    Permission.PROJECT_EDIT,
    Permission.PROJECT_SUBMIT,
    Permission.PROJECT_VIEW
  ],
  user: [
    Permission.CONTENT_VIEW,
    Permission.PROJECT_VIEW
  ]
};

/**
 * Permission aliases to support legacy code
 */
export const PROJECT_PERMISSIONS = {
  CREATE: Permission.PROJECT_CREATE,
  EDIT: Permission.PROJECT_EDIT,
  DELETE: Permission.PROJECT_DELETE,
  SUBMIT: Permission.PROJECT_SUBMIT,
  VIEW: Permission.PROJECT_VIEW
};
