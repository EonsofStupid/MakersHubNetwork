
import { Permission, UserRole } from '@/shared/types/auth.types';
import { getPermissionsForRole } from './roles';

/**
 * Check if a user with the given roles has the required permission
 * 
 * @param userRoles - The roles assigned to the user
 * @param requiredPermission - The permission to check for
 * @returns boolean - Whether the user has the permission
 */
export function checkPermission(userRoles: UserRole[], requiredPermission: Permission): boolean {
  // Get all permissions for the user's roles
  const userPermissions = getPermissionsForRole(userRoles);
  
  // Admin super permission grants access to everything
  if (userPermissions.includes('admin:super')) {
    return true;
  }
  
  // Check if the required permission exists in the user's permissions
  return userPermissions.includes(requiredPermission as Permission);
}

/**
 * Check if a user with the given roles has all of the required permissions
 * 
 * @param userRoles - The roles assigned to the user
 * @param requiredPermissions - The permissions to check for
 * @returns boolean - Whether the user has all the permissions
 */
export function checkAllPermissions(userRoles: UserRole[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => checkPermission(userRoles, permission));
}

/**
 * Check if a user with the given roles has any of the required permissions
 * 
 * @param userRoles - The roles assigned to the user
 * @param requiredPermissions - The permissions to check for
 * @returns boolean - Whether the user has any of the permissions
 */
export function checkAnyPermission(userRoles: UserRole[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => checkPermission(userRoles, permission));
}
