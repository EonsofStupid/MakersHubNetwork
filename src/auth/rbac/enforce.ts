
import { UserRole, Permission } from '@/shared/types/user';

export function checkPermission(userRoles: UserRole[], permission: Permission): boolean {
  // Admin and superadmin have all permissions
  if (userRoles.includes('admin') || userRoles.includes('superadmin')) {
    return true;
  }

  // For other roles, implement specific permission logic
  return false;
}

export function checkAllPermissions(userRoles: UserRole[], permissions: Permission[]): boolean {
  return permissions.every(permission => checkPermission(userRoles, permission));
}

export function checkAnyPermission(userRoles: UserRole[], permissions: Permission[]): boolean {
  return permissions.some(permission => checkPermission(userRoles, permission));
}

export function canAccessAdmin(userRoles: UserRole[]): boolean {
  return userRoles.includes('admin') || userRoles.includes('superadmin');
}

// Export hasPermission for compatibility
export const hasPermission = checkPermission;
