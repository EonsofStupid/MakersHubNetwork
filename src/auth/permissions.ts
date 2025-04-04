
/**
 * Type for permission values
 */
export type PermissionValue = 
  | `role:${string}` 
  | `${string}:*` 
  | `${string}:${string}` 
  | string;

/**
 * Admin permissions enum
 */
export enum AdminPermission {
  ADMIN_VIEW = 'admin:view',
  ADMIN_EDIT = 'admin:edit',
  ADMIN_CREATE = 'admin:create',
  ADMIN_DELETE = 'admin:delete',
  ADMIN_SETTINGS = 'admin:settings',
  ADMIN_USERS = 'admin:users',
  ADMIN_CONTENT = 'admin:content',
  ADMIN_LAYOUTS = 'admin:layouts',
  ADMIN_THEME = 'admin:theme',
  ADMIN_ALL = 'admin:*'
}
