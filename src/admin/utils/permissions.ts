
import { UserRole, UserRoleEnum } from '@/shared/types/shared.types';

/**
 * Check if user has admin permission
 * @param roles Array of user roles
 * @param permission Permission to check
 * @returns Boolean indicating whether the user has the permission
 */
export function hasAdminPermission(roles: UserRole[] = [], permission: string): boolean {
  // Super admins have all permissions
  if (roles.includes(UserRoleEnum.SUPERADMIN)) {
    return true;
  }
  
  // Admins have basic admin permissions
  if (permission === 'view_admin_panel' && roles.includes(UserRoleEnum.ADMIN)) {
    return true;
  }
  
  // In a real app, we would check against a permissions database or API
  // For now, we'll just hardcode some basic rules
  
  return false;
}

/**
 * Check if a user has any of the required roles
 * @param userRoles Array of user's roles
 * @param requiredRoles Array of required roles (any match grants access)
 * @returns Boolean indicating if the user has any of the required roles
 */
export function hasAnyRole(userRoles: UserRole[] = [], requiredRoles: UserRole[]): boolean {
  if (userRoles.includes(UserRoleEnum.SUPERADMIN)) {
    return true;
  }
  
  return requiredRoles.some(role => userRoles.includes(role));
}

/**
 * Check if a user has all of the required roles
 * @param userRoles Array of user's roles
 * @param requiredRoles Array of required roles (all must match)
 * @returns Boolean indicating if the user has all of the required roles
 */
export function hasAllRoles(userRoles: UserRole[] = [], requiredRoles: UserRole[]): boolean {
  if (userRoles.includes(UserRoleEnum.SUPERADMIN)) {
    return true;
  }
  
  return requiredRoles.every(role => userRoles.includes(role));
}
