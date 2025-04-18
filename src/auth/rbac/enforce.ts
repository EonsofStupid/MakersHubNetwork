
import { AuthPermissionValue, AUTH_PERMISSIONS } from "../constants/permissions";
import { UserRole, ROLES } from "@/shared/types/core/auth.types";
import { mapRolesToPermissions } from "./roles";

/**
 * Check if a user has the required permission based on their roles
 * @param userRoles Array of user roles
 * @param permission Permission to check
 * @returns Boolean indicating if the user has the permission
 */
export const hasPermission = (
  userRoles: UserRole[] = [],
  permission: AuthPermissionValue
): boolean => {
  const permissions = mapRolesToPermissions(userRoles);
  
  // Super admin permission grants access to everything
  if (permissions.includes(AUTH_PERMISSIONS.SUPER_ADMIN)) {
    return true;
  }
  
  // Check for specific permission
  return permissions.includes(permission);
};

/**
 * Higher-order function to create a permission checker with preset roles
 * @param userRoles Array of user roles
 * @returns A function that checks if the user has a specific permission
 */
export const createPermissionChecker = (userRoles: UserRole[] = []) => {
  return (permission: AuthPermissionValue): boolean => {
    return hasPermission(userRoles, permission);
  };
};

/**
 * Check if user has admin access
 */
export const canAccessAdmin = (userRoles: UserRole[] = []): boolean => {
  return userRoles.includes(ROLES.admin) || userRoles.includes(ROLES.super_admin);
};

/**
 * Check if user can use development features
 */
export const canAccessDevFeatures = (userRoles: UserRole[] = []): boolean => {
  return userRoles.includes(ROLES.admin) || userRoles.includes(ROLES.super_admin);
};
