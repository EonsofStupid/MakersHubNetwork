
import { UserRole } from "../types/auth.types";
import { PermissionValue, PERMISSIONS } from "../permissions";

/**
 * Maps user roles to app permissions
 * @param roles Array of user roles
 * @returns Array of app permissions
 */
export const mapRolesToPermissions = (roles: UserRole[] = []): PermissionValue[] => {
  let permissions: PermissionValue[] = [];
  
  // Super admins get all permissions
  if (roles.includes('super_admin')) {
    return [PERMISSIONS.SUPER_ADMIN];
  }
  
  // Map admin role to permissions
  if (roles.includes('admin')) {
    permissions = [
      ...permissions,
      PERMISSIONS.ADMIN_ACCESS,
      PERMISSIONS.ADMIN_VIEW,
      PERMISSIONS.ADMIN_EDIT,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.CONTENT_EDIT,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.BUILDS_VIEW,
      PERMISSIONS.BUILDS_APPROVE,
      PERMISSIONS.THEMES_VIEW,
      PERMISSIONS.SYSTEM_LOGS
    ];
  }
  
  // Map maker role to permissions
  if (roles.includes('maker')) {
    permissions = [
      ...permissions,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.CONTENT_EDIT,
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.BUILDS_VIEW
    ];
  }
  
  // Map builder role to permissions
  if (roles.includes('builder')) {
    permissions = [
      ...permissions,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.BUILDS_VIEW,
      PERMISSIONS.BUILDS_CREATE,
      PERMISSIONS.REVIEWS_VIEW
    ];
  }
  
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
