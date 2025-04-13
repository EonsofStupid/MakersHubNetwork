
/**
 * auth/rbac/roles.ts
 * 
 * Role-based access control mapping
 * Maps roles to permissions
 */

import { UserRole, UserRoleEnum } from '@/shared/types/shared.types';
import { PermissionValue, PERMISSIONS } from '@/auth/permissions';

// Map roles to their allowed permissions
const rolePermissionsMap: Record<UserRole, PermissionValue[]> = {
  'super_admin': Object.values(PERMISSIONS),
  'admin': [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.CREATE_CONTENT, PERMISSIONS.EDIT_CONTENT, PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.VIEW_USERS, PERMISSIONS.EDIT_USERS,
    PERMISSIONS.SYSTEM_VIEW, 
  ],
  'editor': [
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.CREATE_CONTENT, PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.VIEW_USERS,
  ],
  'moderator': [
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.VIEW_USERS,
  ],
  'builder': [
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.CREATE_CONTENT,
  ],
  'maker': [
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.CREATE_CONTENT,
  ],
  'viewer': [
    PERMISSIONS.VIEW_CONTENT,
  ],
  'user': [
    PERMISSIONS.VIEW_CONTENT,
  ],
  'guest': []
};

// Create an object with role constants
export const ROLES = {
  SUPER_ADMIN: UserRoleEnum.SUPERADMIN,
  ADMIN: UserRoleEnum.ADMIN,
  EDITOR: 'editor',
  MODERATOR: UserRoleEnum.MODERATOR,
  BUILDER: UserRoleEnum.BUILDER,
  USER: UserRoleEnum.USER,
  GUEST: UserRoleEnum.GUEST
};

/**
 * Map user roles to their corresponding permissions
 * @param roles Array of user roles
 * @returns Array of permissions granted to the user
 */
export function mapRolesToPermissions(roles: UserRole[]): PermissionValue[] {
  // Get all permissions for the user's roles
  const permissions = roles.flatMap(role => rolePermissionsMap[role] || []);
  
  // Remove duplicates
  return [...new Set(permissions)];
}

/**
 * Check if user has admin access based on roles
 * @param roles User roles to check
 * @returns Boolean indicating if the user has admin access
 */
export function hasAdminAccess(roles: UserRole[]): boolean {
  return roles.some(role => role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN);
}

/**
 * Check if user is a super admin
 * @param roles User roles to check
 * @returns Boolean indicating if the user is a super admin
 */
export function isSuperAdmin(roles: UserRole[]): boolean {
  return roles.includes(ROLES.SUPER_ADMIN);
}
