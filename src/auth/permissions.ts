
/**
 * auth/permissions.ts
 * 
 * Define permissions used throughout the application
 */

export type PermissionValue = string;

export const PERMISSIONS = {
  // Content management
  VIEW_CONTENT: 'view:content',
  CREATE_CONTENT: 'create:content',
  EDIT_CONTENT: 'edit:content',
  DELETE_CONTENT: 'delete:content',
  
  // User management
  VIEW_USERS: 'view:users',
  EDIT_USERS: 'edit:users',
  DELETE_USERS: 'delete:users',
  
  // Admin access
  ADMIN_ACCESS: 'admin:access',
  SUPER_ADMIN_ACCESS: 'admin:super',
  
  // System management
  VIEW_SYSTEM: 'view:system',
  EDIT_SYSTEM: 'edit:system',
  
  // Development tools
  DEV_TOOLS: 'dev:tools',
};
