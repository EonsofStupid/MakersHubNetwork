
/**
 * Role-Based Access Control (RBAC) types
 */
import { UserRole } from './auth.types';

// Permission type - consolidated all permissions into a single type 
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
  '/admin': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/admin/users': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/admin/roles': [UserRole.SUPER_ADMIN],
  '/admin/permissions': [UserRole.SUPER_ADMIN],
  '/admin/analytics': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/create': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/edit': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/delete': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
} as const;

export type PATH_POLICIES = typeof RBAC_POLICIES;

// Common role groups
export const RBAC = {
  ADMIN_ONLY: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  SUPER_ADMINS: [UserRole.SUPER_ADMIN],
  MODERATORS: [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  BUILDERS: [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  AUTHENTICATED: [UserRole.USER, UserRole.MODERATOR, UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
};

// Admin section type
export type AdminSection = 'dashboard' | 'users' | 'content' | 'settings' | 'system';

// Role labels for UI display
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.MODERATOR]: 'Moderator',
  [UserRole.BUILDER]: 'Builder',
  [UserRole.USER]: 'User',
  [UserRole.GUEST]: 'Guest',
};

// Section permissions
export const SECTION_PERMISSIONS: Record<AdminSection, UserRole[]> = {
  dashboard: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  users: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  content: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR],
  settings: [UserRole.SUPER_ADMIN],
  system: [UserRole.SUPER_ADMIN]
};

