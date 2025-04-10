
import { UserRole } from '../types/roles';
import { useAuthStore } from '../store/auth.store';

/**
 * Check if user has one of the specified roles
 * @param role Single role or array of roles to check against
 * @returns Boolean indicating if user has at least one of the specified roles
 */
export const hasRole = (role: UserRole | UserRole[] | string | string[]): boolean => {
  const userRoles = useAuthStore.getState().roles || [];
  
  // Handle the case where role is a string or array of strings
  if (typeof role === 'string') {
    return userRoles.includes(role);
  }
  
  if (Array.isArray(role)) {
    return role.some(r => userRoles.includes(r));
  }
  
  return false;
};

/**
 * Check if user has admin access (admin or super_admin)
 * @returns Boolean indicating if user has admin access
 */
export const hasAdminAccess = (): boolean => {
  return hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
};

/**
 * Check if user is a super admin
 * @returns Boolean indicating if user is a super admin
 */
export const isSuperAdmin = (): boolean => {
  return hasRole(UserRole.SUPER_ADMIN);
};
