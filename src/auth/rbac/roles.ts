
import { UserRole } from "../types/auth.types";
import { AppPermissionValue, APP_PERMISSIONS } from "../constants/permissions";

/**
 * Maps user roles to app permissions
 * @param roles Array of user roles
 * @returns Array of app permissions
 */
export const mapRolesToPermissions = (roles: UserRole[] = []): AppPermissionValue[] => {
  let permissions: AppPermissionValue[] = [];
  
  // Super admins get all permissions
  if (roles.includes('super_admin')) {
    return [APP_PERMISSIONS.SUPER_ADMIN];
  }
  
  // Map admin role to permissions
  if (roles.includes('admin')) {
    permissions = [
      ...permissions,
      APP_PERMISSIONS.ADMIN_ACCESS,
      APP_PERMISSIONS.ADMIN_VIEW,
      APP_PERMISSIONS.ADMIN_EDIT,
      APP_PERMISSIONS.CONTENT_VIEW,
      APP_PERMISSIONS.CONTENT_EDIT,
      APP_PERMISSIONS.USERS_VIEW,
      APP_PERMISSIONS.BUILDS_VIEW,
      APP_PERMISSIONS.BUILDS_APPROVE,
      APP_PERMISSIONS.THEMES_VIEW,
      APP_PERMISSIONS.SYSTEM_LOGS
    ];
  }
  
  // Map editor role to permissions (example)
  if (roles.includes('editor')) {
    permissions = [
      ...permissions,
      APP_PERMISSIONS.CONTENT_VIEW,
      APP_PERMISSIONS.CONTENT_EDIT,
      APP_PERMISSIONS.CONTENT_CREATE,
      APP_PERMISSIONS.BUILDS_VIEW
    ];
  }
  
  // Map moderator role to permissions (example)
  if (roles.includes('moderator')) {
    permissions = [
      ...permissions,
      APP_PERMISSIONS.CONTENT_VIEW,
      APP_PERMISSIONS.BUILDS_VIEW,
      APP_PERMISSIONS.REVIEWS_VIEW,
      APP_PERMISSIONS.REVIEWS_APPROVE,
      APP_PERMISSIONS.REVIEWS_REJECT
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
