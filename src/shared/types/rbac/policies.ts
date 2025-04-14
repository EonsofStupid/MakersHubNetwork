
import { UserRole } from '../shared.types';

/**
 * PATH_POLICIES object maps URL paths to allowed user roles
 * Note: This is now a value, not just a type
 */
export const PATH_POLICIES = {
  '/admin': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/admin/users': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/admin/roles': [UserRole.SUPER_ADMIN],
  '/admin/permissions': [UserRole.SUPER_ADMIN],
  '/admin/analytics': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/create': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/edit': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/delete': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
} as const;

export type PathPolicies = typeof PATH_POLICIES;
