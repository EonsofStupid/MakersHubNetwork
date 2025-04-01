
export type AdminPermissionAction = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'manage' 
  | 'approve' 
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
  | 'all';

export type AdminPermissionValue = `${AdminPermissionAction}:${AdminPermissionSubject}`;

export const ADMIN_PERMISSIONS: Record<string, AdminPermissionValue> = {
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
  UPDATE_SECURITY: 'update:security',
  
  // Super admin permission
  ALL: 'all:all'
};
