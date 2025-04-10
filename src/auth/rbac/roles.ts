
import { UserRole } from "../types/auth.types";
import { PermissionValue, PERMISSIONS, ROLE_PERMISSIONS } from "../permissions";

/**
 * Maps user roles to app permissions
 */
export const mapRolesToPermissions = (roles: UserRole[] = []): PermissionValue[] => {
  // If no roles, return empty permissions array
  if (!roles.length) {
    return [];
  }
  
  // Super admins get all permissions
  if (roles.includes('super_admin')) {
    return [PERMISSIONS.SUPER_ADMIN];
  }
  
  // Combine permissions from all roles
  const permissions: PermissionValue[] = [];
  
  roles.forEach(role => {
    const rolePermissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
    if (rolePermissions) {
      rolePermissions.forEach(permission => {
        if (!permissions.includes(permission)) {
          permissions.push(permission);
        }
      });
    }
  });
  
  return permissions;
};

/**
 * Helper function to check if a user has a specific role
 */
export const hasRole = (userRoles: UserRole[] = [], role: UserRole): boolean => {
  return userRoles.includes(role);
};

/**
 * Helper function to check if a user has admin access
 */
export const hasAdminAccess = (userRoles: UserRole[] = []): boolean => {
  return userRoles.includes('admin') || userRoles.includes('super_admin');
};

/**
 * Helper function to check if a user is a super admin
 */
export const isSuperAdmin = (userRoles: UserRole[] = []): boolean => {
  return userRoles.includes('super_admin');
};
