
import { UserRole } from './roles';

/**
 * PATH_POLICIES object maps URL paths to allowed user roles
 */
export const PATH_POLICIES = {
  '/admin': [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/admin/users': [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/admin/roles': [UserRole.SUPER_ADMIN] as UserRole[],
  '/admin/permissions': [UserRole.SUPER_ADMIN] as UserRole[],
  '/admin/keys': [UserRole.SUPER_ADMIN] as UserRole[],
  '/admin/analytics': [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/projects/create': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/projects/edit': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/projects/delete': [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]
};

// Admin section policies
export const ADMIN_SECTION_POLICIES = {
  dashboard: [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  users: [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  content: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR] as UserRole[],
  settings: [UserRole.SUPER_ADMIN] as UserRole[],
  system: [UserRole.SUPER_ADMIN] as UserRole[]
};

// Export for type usage
export type PathPolicies = typeof PATH_POLICIES;
export type AdminSectionPolicies = typeof ADMIN_SECTION_POLICIES;
