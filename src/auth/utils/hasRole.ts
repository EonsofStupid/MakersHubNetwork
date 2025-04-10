
import { UserRole, ROLES } from '@/types/shared';
import { AuthBridge } from '@/bridges/AuthBridge';

/**
 * Check if user has one of the specified roles
 * Use AuthBridge to ensure consistent behavior across the app
 * @param role Single role or array of roles to check against
 * @returns Boolean indicating if user has at least one of the specified roles
 */
export const hasRole = (role: UserRole | UserRole[] | undefined): boolean => {
  if (!role) return false;
  return AuthBridge.hasRole(role);
};

/**
 * Check if user has admin access (admin or super_admin)
 * Use AuthBridge to ensure consistent behavior across the app
 * @returns Boolean indicating if user has admin access
 */
export const hasAdminAccess = (): boolean => {
  return AuthBridge.isAdmin();
};

/**
 * Check if user is a super admin
 * Use AuthBridge to ensure consistent behavior across the app
 * @returns Boolean indicating if user is a super admin
 */
export const isSuperAdmin = (): boolean => {
  return AuthBridge.isSuperAdmin();
};
