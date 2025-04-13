import { UserRole, ROLES } from '@/shared/types/SharedTypes';
import { AdminSection, SECTION_PERMISSIONS, ROLE_LABELS } from './types/RBACTypes';

/**
 * Core RBAC functionality
 * This module is responsible for role-based access control logic
 * but does NOT handle authentication state directly
 */

/**
 * Check if a user has the specified role(s)
 * @param userRoles Array of user roles to check
 * @param requiredRole Single role or array of roles to check against
 * @returns Boolean indicating if user has the required role(s)
 */
export function hasRole(
  userRoles: UserRole[],
  requiredRole: UserRole | UserRole[]
): boolean {
  // If no user roles, return false
  if (!userRoles || userRoles.length === 0) return false;
  
  // Superadmin has all roles
  if (userRoles.includes(ROLES.SUPERADMIN)) return true;
  
  // Check for specific roles
  const rolesToCheck = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return rolesToCheck.some(role => userRoles.includes(role));
}

/**
 * Check if user has admin access (admin or superadmin)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user has admin access
 */
export function hasAdminAccess(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.ADMIN, ROLES.SUPERADMIN]);
}

/**
 * Check if user is a super admin
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user is a super admin
 */
export function isSuperAdmin(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, ROLES.SUPERADMIN);
}

/**
 * Check if user is a moderator (or higher)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user is a moderator or higher
 */
export function isModerator(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPERADMIN]);
}

/**
 * Check if user is a builder (or higher)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user is a builder or higher
 */
export function isBuilder(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPERADMIN]);
}

/**
 * Get the highest role for a user
 * @param userRoles Array of user roles to check
 * @returns The highest role the user has
 */
export function getHighestRole(userRoles: UserRole[]): UserRole {
  if (hasRole(userRoles, ROLES.SUPERADMIN)) return ROLES.SUPERADMIN;
  if (hasRole(userRoles, ROLES.ADMIN)) return ROLES.ADMIN;
  if (hasRole(userRoles, ROLES.MODERATOR)) return ROLES.MODERATOR;
  if (hasRole(userRoles, ROLES.BUILDER)) return ROLES.BUILDER;
  return ROLES.USER;
}

/**
 * Check if user has elevated privileges (admin or higher)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user has elevated privileges
 */
export function hasElevatedPrivileges(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.ADMIN, ROLES.SUPERADMIN]);
}

/**
 * Check if user can access a specific admin section
 * @param userRoles Array of user roles to check
 * @param section Admin section to check access for
 * @returns Boolean indicating if user can access the section
 */
export function canAccessAdminSection(userRoles: UserRole[], section: AdminSection): boolean {
  // Super admins can access everything
  if (hasRole(userRoles, ROLES.SUPERADMIN)) return true;

  const allowedRoles = SECTION_PERMISSIONS[section];
  if (!allowedRoles) return false;

  return hasRole(userRoles, allowedRoles);
}

/**
 * Get role labels for UI display
 * @returns Record of role keys to display labels
 */
export function getRoleLabels(): Record<UserRole, string> {
  return ROLE_LABELS;
} 