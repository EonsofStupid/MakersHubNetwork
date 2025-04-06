
import { UserRole } from '../types/auth.types';

/**
 * Checks if a user has a specific required role
 */
export function hasRequiredRole(userRoles: UserRole[] | undefined, requiredRole: UserRole): boolean {
  if (!userRoles) return false;
  return userRoles.includes(requiredRole);
}

/**
 * Checks if a user has admin permissions
 */
export function isAdmin(userRoles: UserRole[] | undefined): boolean {
  if (!userRoles) return false;
  return userRoles.some(role => role === 'admin' || role === 'super_admin');
}

/**
 * Checks if a user has super admin permissions
 */
export function isSuperAdmin(userRoles: UserRole[] | undefined): boolean {
  if (!userRoles) return false;
  return userRoles.includes('super_admin');
}
