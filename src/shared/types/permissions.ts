
export enum Permission {
  // Admin permissions
  ADMIN_ACCESS = 'admin_access',
  ADMIN_VIEW = 'admin_view',
  ADMIN_EDIT = 'admin_edit',
  
  // Content permissions
  CONTENT_VIEW = 'content_view',
  CONTENT_CREATE = 'content_create',
  CONTENT_EDIT = 'content_edit',
  CONTENT_DELETE = 'content_delete',
  
  // User permissions
  USER_VIEW = 'user_view',
  USER_EDIT = 'user_edit',
  USER_DELETE = 'user_delete',
  
  // Project permissions
  PROJECT_CREATE = 'project_create',
  PROJECT_EDIT = 'project_edit',
  PROJECT_VIEW = 'project_view',
  PROJECT_DELETE = 'project_delete',
  PROJECT_SUBMIT = 'project_submit',
  
  // System permissions
  SYSTEM_VIEW = 'system_view',
  SYSTEM_EDIT = 'system_edit',
  SETTINGS_VIEW = 'settings_view',
  SETTINGS_EDIT = 'settings_edit',
  
  // Analytics permissions
  ANALYTICS_VIEW = 'analytics_view'
}

// Define default permissions (all false by default)
export const DEFAULT_PERMISSIONS: Record<Permission, boolean> = Object.values(Permission).reduce(
  (acc, permission) => {
    acc[permission] = false;
    return acc;
  },
  {} as Record<Permission, boolean>
);
