
import { UserRole } from "../types/roles";
import { PermissionValue, PERMISSIONS } from "../permissions";

/**
 * Maps user roles to app permissions
 */
export const mapRolesToPermissions = (roles: UserRole[] = []): PermissionValue[] => {
  // If no roles, return empty permissions array
  if (!roles.length) {
    return [];
  }
  
  // Super admins get all permissions
  if (roles.includes(UserRole.SUPER_ADMIN)) {
    return [PERMISSIONS.SUPER_ADMIN];
  }
  
  // Combine permissions from all roles
  const permissions: PermissionValue[] = [];
  
  roles.forEach(role => {
    const rolePermissions = ROLE_PERMISSIONS[role];
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
export const hasRole = (userRoles: UserRole[] = [], role: UserRole | UserRole[]): boolean => {
  if (Array.isArray(role)) {
    return role.some(r => userRoles.includes(r));
  }
  return userRoles.includes(role);
};

/**
 * Helper function to check if a user has admin access
 */
export const hasAdminAccess = (userRoles: UserRole[] = []): boolean => {
  return userRoles.includes(UserRole.ADMIN) || userRoles.includes(UserRole.SUPER_ADMIN);
};

/**
 * Helper function to check if a user is a super admin
 */
export const isSuperAdmin = (userRoles: UserRole[] = []): boolean => {
  return userRoles.includes(UserRole.SUPER_ADMIN);
};

/**
 * Map roles to permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, PermissionValue[]> = {
  [UserRole.SUPER_ADMIN]: [PERMISSIONS.SUPER_ADMIN],
  [UserRole.ADMIN]: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.ADMIN_EDIT,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.BUILDS_VIEW,
    PERMISSIONS.BUILDS_APPROVE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.THEMES_VIEW,
    PERMISSIONS.SYSTEM_LOGS
  ],
  [UserRole.MAKER]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.BUILDS_VIEW
  ],
  [UserRole.BUILDER]: [
    PERMISSIONS.BUILDS_VIEW,
    PERMISSIONS.BUILDS_CREATE,
    PERMISSIONS.CONTENT_VIEW
  ],
  [UserRole.EDITOR]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_CREATE
  ],
  [UserRole.MODERATOR]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.REVIEWS_VIEW,
    PERMISSIONS.REVIEWS_APPROVE,
    PERMISSIONS.REVIEWS_REJECT
  ],
  [UserRole.VIEWER]: [
    PERMISSIONS.CONTENT_VIEW
  ],
  [UserRole.USER]: []
};
