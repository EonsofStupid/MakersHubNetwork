
import { UserRole, Permission } from "@/shared/types/user";
import { ADMIN_PERMISSIONS } from "@/admin/constants/permissions";

// The core permission checking functions

/**
 * Check if user has admin access based on roles
 */
export function canAccessAdmin(roles: UserRole[]): boolean {
  return roles.includes('admin') || roles.includes('superadmin');
}

/**
 * Check if a user has a specific permission based on their roles
 */
export function checkPermission(roles: UserRole[], permission: Permission): boolean {
  // Superadmin has all permissions
  if (roles.includes('superadmin')) {
    return true;
  }
  
  // Admin has access to admin permissions
  if (permission.startsWith('admin.') && roles.includes('admin')) {
    // Special case: some admin permissions might be restricted to superadmin only
    if (permission === ADMIN_PERMISSIONS.SYSTEM_WRITE) {
      return false;
    }
    return true;
  }
  
  // For other roles, specific permissions need to be defined
  // This is a simplified implementation that can be extended
  // with a more sophisticated permission matrix
  
  // Return false by default
  return false;
}

/**
 * Check if a user has all of the given permissions
 */
export function checkAllPermissions(roles: UserRole[], permissions: Permission[]): boolean {
  return permissions.every(permission => checkPermission(roles, permission));
}

/**
 * Check if a user has any of the given permissions
 */
export function checkAnyPermission(roles: UserRole[], permissions: Permission[]): boolean {
  return permissions.some(permission => checkPermission(roles, permission));
}

/**
 * Check if user has a role or any of the roles
 */
export function hasPermission(roles: UserRole[], role: UserRole | UserRole[]): boolean {
  if (Array.isArray(role)) {
    return role.some(r => roles.includes(r));
  }
  return roles.includes(role);
}

/**
 * Check if roles include a moderator or admin role
 */
export function hasModeratorAccess(roles: UserRole[]): boolean {
  return roles.includes('moderator') || canAccessAdmin(roles);
}
