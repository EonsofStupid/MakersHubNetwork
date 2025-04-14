
import { UserRole, ROLES } from '@/shared/types';

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
  if (userRoles.includes(ROLES.SUPER_ADMIN)) return true;
  
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
  return hasRole(userRoles, [ROLES.ADMIN, ROLES.SUPER_ADMIN]);
}

/**
 * Check if user is a super admin
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user is a super admin
 */
export function isSuperAdmin(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, ROLES.SUPER_ADMIN);
}

/**
 * Check if user is a moderator (or higher)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user is a moderator or higher
 */
export function isModerator(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
}

/**
 * Check if user is a builder (or higher)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user is a builder or higher
 */
export function isBuilder(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
}

/**
 * Get the highest role for a user
 * @param userRoles Array of user roles to check
 * @returns The highest role the user has
 */
export function getHighestRole(userRoles: UserRole[]): UserRole {
  if (hasRole(userRoles, ROLES.SUPER_ADMIN)) return ROLES.SUPER_ADMIN;
  if (hasRole(userRoles, ROLES.ADMIN)) return ROLES.ADMIN;
  if (hasRole(userRoles, ROLES.MODERATOR)) return ROLES.MODERATOR;
  if (hasRole(userRoles, ROLES.BUILDER)) return ROLES.BUILDER;
  if (hasRole(userRoles, ROLES.USER)) return ROLES.USER;
  return ROLES.GUEST;
}

/**
 * Check if user has elevated privileges (admin or higher)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user has elevated privileges
 */
export function hasElevatedPrivileges(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.ADMIN, ROLES.SUPER_ADMIN]);
}

/**
 * Check if user can access a specific admin section
 * @param userRoles Array of user roles to check
 * @param section Admin section to check access for
 * @returns Boolean indicating if user can access the section
 */
export function canAccessAdminSection(userRoles: UserRole[], section: string): boolean {
  // Super admins can access everything
  if (hasRole(userRoles, ROLES.SUPER_ADMIN)) return true;

  // Define section permissions
  const sectionPermissions: Record<string, UserRole[]> = {
    dashboard: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    users: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    content: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MODERATOR],
    settings: [ROLES.SUPER_ADMIN],
    system: [ROLES.SUPER_ADMIN]
  };

  const allowedRoles = sectionPermissions[section];
  if (!allowedRoles) return false;

  return hasRole(userRoles, allowedRoles);
}

/**
 * Get role labels for UI display
 * @returns Record of role keys to display labels
 */
export function getRoleLabels(): Record<UserRole, string> {
  return {
    [ROLES.USER]: 'User',
    [ROLES.ADMIN]: 'Admin',
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.MODERATOR]: 'Moderator',
    [ROLES.BUILDER]: 'Builder',
    [ROLES.GUEST]: 'Guest'
  };
}
