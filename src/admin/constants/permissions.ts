
export type AdminPermissionAction = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'manage' 
  | 'approve' 
  | 'reject'
  | 'all';

export type AdminPermissionSubject = 
  | 'users' 
  | 'builds' 
  | 'content' 
  | 'settings' 
  | 'roles' 
  | 'analytics' 
  | 'reports' 
  | 'security'
  | 'database'
  | 'code'
  | 'admin'
  | 'themes'
  | 'all';

export type AdminPermissionValue = `${AdminPermissionAction}:${AdminPermissionSubject}`;

export const ADMIN_PERMISSIONS: Record<string, AdminPermissionValue> = {
  // Admin permissions
  ADMIN_ACCESS: 'read:admin',
  ADMIN_VIEW: 'read:admin',
  ADMIN_EDIT: 'update:admin',
  SUPER_ADMIN: 'all:all',
  
  // User permissions
  USERS_VIEW: 'read:users',
  USERS_EDIT: 'update:users',
  USERS_DELETE: 'delete:users',
  
  // Content permissions
  CONTENT_VIEW: 'read:content',
  CONTENT_EDIT: 'update:content',
  CONTENT_DELETE: 'delete:content',
  
  // Build permissions
  BUILDS_VIEW: 'read:builds',
  BUILDS_APPROVE: 'approve:builds',
  BUILDS_REJECT: 'reject:builds',
  
  // Theme permissions
  THEMES_VIEW: 'read:themes',
  THEMES_EDIT: 'update:themes',
  THEMES_DELETE: 'delete:themes',
  
  // Settings permissions
  SETTINGS_VIEW: 'read:settings',
  SETTINGS_EDIT: 'update:settings',
  
  // Data permissions
  DATA_VIEW: 'read:database',
  DATA_IMPORT: 'update:database',
  
  // Legacy permission mappings for backward compatibility
  READ_USERS: 'read:users',
  CREATE_USERS: 'create:users',
  UPDATE_USERS: 'update:users',
  DELETE_USERS: 'delete:users',
  MANAGE_USERS: 'manage:users',
  
  READ_BUILDS: 'read:builds',
  CREATE_BUILDS: 'create:builds',
  UPDATE_BUILDS: 'update:builds',
  DELETE_BUILDS: 'delete:builds',
  APPROVE_BUILDS: 'approve:builds',
  
  READ_CONTENT: 'read:content',
  CREATE_CONTENT: 'create:content',
  UPDATE_CONTENT: 'update:content',
  DELETE_CONTENT: 'delete:content',
  
  READ_SETTINGS: 'read:settings',
  UPDATE_SETTINGS: 'update:settings',
  
  MANAGE_ROLES: 'manage:roles',
  
  READ_ANALYTICS: 'read:analytics',
  
  READ_REPORTS: 'read:reports',
  CREATE_REPORTS: 'create:reports',
  
  READ_SECURITY: 'read:security',
  UPDATE_SECURITY: 'update:security'
};
