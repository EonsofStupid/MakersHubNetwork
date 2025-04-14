
/**
 * RBAC Policy Definitions
 * Central source of truth for route policies in the application
 */
import { UserRole } from './roles';

/**
 * Define path-based access policies
 * Maps URL paths to allowed user roles
 */
export const PATH_POLICIES = {
  '/admin': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/admin/users': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/admin/roles': [UserRole.SUPER_ADMIN],
  '/admin/permissions': [UserRole.SUPER_ADMIN],
  '/admin/analytics': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/admin/settings': [UserRole.SUPER_ADMIN],
  '/admin/content': [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR],
  '/projects/create': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/edit': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/delete': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
} as const;

export type PathPolicies = typeof PATH_POLICIES;

/**
 * Define admin section access policies
 * Maps admin sections to permission requirements
 */
export const ADMIN_SECTION_POLICIES = {
  'dashboard': 'admin:view',
  'users': 'user:view',
  'content': 'content:view',
  'settings': 'settings:view',
  'analytics': 'view_analytics',
  'system': 'system:view'
} as const;
