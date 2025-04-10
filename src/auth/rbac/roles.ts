
/**
 * auth/rbac/roles.ts
 * 
 * Role-based access control mapping
 * Maps roles to permissions
 */

import { UserRole, ROLES } from '@/types/shared';
import { PermissionValue, PERMISSIONS } from '@/auth/permissions';

// Map roles to their allowed permissions
const rolePermissionsMap: Record<UserRole, PermissionValue[]> = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.CREATE_CONTENT, PERMISSIONS.EDIT_CONTENT, PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.VIEW_USERS, PERMISSIONS.EDIT_USERS,
    PERMISSIONS.VIEW_SYSTEM, 
  ],
  editor: [
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.CREATE_CONTENT, PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.VIEW_USERS,
  ],
  moderator: [
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.VIEW_USERS,
  ],
  builder: [
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.CREATE_CONTENT,
  ],
  maker: [
    PERMISSIONS.VIEW_CONTENT, PERMISSIONS.CREATE_CONTENT,
  ],
  viewer: [
    PERMISSIONS.VIEW_CONTENT,
  ],
  user: [
    PERMISSIONS.VIEW_CONTENT,
  ],
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
