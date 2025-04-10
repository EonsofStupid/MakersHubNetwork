
import { UserRole, ROLES } from '../types/roles';
import { useAuthStore } from '../store/auth.store';

/**
 * Check if user has one of the specified roles
 * @param role Single role or array of roles to check against
 * @returns Boolean indicating if user has at least one of the specified roles
 */
export const hasRole = (role: UserRole | UserRole[]): boolean => {
  const userRoles = useAuthStore.getState().roles || [];
  
  if (Array.isArray(role)) {
    return role.some(r => userRoles.includes(r));
  }
  
  return userRoles.includes(role);
};

/**
 * Check if user has admin access (admin or super_admin)
 * @returns Boolean indicating if user has admin access
 */
export const hasAdminAccess = (): boolean => {
  const userRoles = useAuthStore.getState().roles || [];
  return userRoles.includes(ROLES.ADMIN) || userRoles.includes(ROLES.SUPER_ADMIN);
};

/**
 * Check if user is a super admin
 * @returns Boolean indicating if user is a super admin
 */
export const isSuperAdmin = (): boolean => {
  const userRoles = useAuthStore.getState().roles || [];
  return userRoles.includes(ROLES.SUPER_ADMIN);
};
