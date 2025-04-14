
/**
 * Role-Based Access Control (RBAC) types
 */
import { UserRole, ROLES } from './auth.types';

// Permission type
export type Permission =
  | 'create_project'
  | 'edit_project'
  | 'delete_project'
  | 'submit_build'
  | 'access_admin'
  | 'manage_api_keys'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_permissions'
  | 'view_analytics'
  | 'admin:view'
  | 'admin:edit'
  | 'admin:delete'
  | 'user:view'
  | 'user:edit'
  | 'user:delete'
  | 'content:view'
  | 'content:edit'
  | 'content:delete'
  | 'settings:view'
  | 'settings:edit';

// Path-based access policies
export const RBAC_POLICIES = {
  '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/users': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/roles': [ROLES.SUPER_ADMIN],
  '/admin/permissions': [ROLES.SUPER_ADMIN],
  '/admin/analytics': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/create': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/edit': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/delete': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
} as const;

export type PATH_POLICIES = typeof RBAC_POLICIES;

// Common role groups
export const RBAC = {
  ADMIN_ONLY: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  SUPER_ADMINS: [ROLES.SUPER_ADMIN],
  MODERATORS: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  BUILDERS: [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  AUTHENTICATED: [ROLES.USER, ROLES.MODERATOR, ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
};

// Admin section type
export type AdminSection = 'dashboard' | 'users' | 'content' | 'settings' | 'system';

// Role labels for UI display
export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MODERATOR]: 'Moderator',
  [ROLES.BUILDER]: 'Builder',
  [ROLES.USER]: 'User',
  [ROLES.GUEST]: 'Guest',
};

// Section permissions
export const SECTION_PERMISSIONS: Record<AdminSection, UserRole[]> = {
  dashboard: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  users: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  content: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MODERATOR],
  settings: [ROLES.SUPER_ADMIN],
  system: [ROLES.SUPER_ADMIN]
};
