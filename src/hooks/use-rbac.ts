import { useAuthStore } from '@/stores/auth/auth.store';
import { UserRole, RBAC, PATH_POLICIES } from '@/shared/types/shared.types';

/**
 * Custom hook for role-based access control
 * 
 * @param allowedRoles - Single role or array of roles to check against
 * @returns boolean indicating if the current user has the required roles
 */
export const useHasRole = (allowedRoles: UserRole | UserRole[]): boolean => {
  const { roles } = useAuthStore();
  return useAuthStore.getState().hasRole(allowedRoles);
};

/**
 * Custom hook to check if the current user has admin privileges
 * 
 * @returns boolean indicating if the current user is an admin or super admin
 */
export const useIsAdmin = (): boolean => {
  return useHasRole(RBAC.adminOnly);
};

/**
 * Custom hook to check if the current user has super admin privileges
 * 
 * @returns boolean indicating if the current user is a super admin
 */
export const useIsSuperAdmin = (): boolean => {
  return useHasRole(RBAC.superAdmins);
};

/**
 * Custom hook to check if the current user has moderator privileges
 * 
 * @returns boolean indicating if the current user is a moderator, admin, or super admin
 */
export const useIsModerator = (): boolean => {
  return useHasRole(RBAC.moderators);
};

/**
 * Custom hook to check if the current user has builder privileges
 * 
 * @returns boolean indicating if the current user is a builder, admin, or super admin
 */
export const useIsBuilder = (): boolean => {
  return useHasRole(RBAC.builders);
};

/**
 * Custom hook to check if the current user is authenticated
 * 
 * @returns boolean indicating if the current user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  return useAuthStore(state => state.isAuthenticated);
};

/**
 * Custom hook to check if the current user can access a specific path
 * 
 * @param path - The path to check access for
 * @returns boolean indicating if the current user can access the path
 */
export const useCanAccessPath = (path: string): boolean => {
  const { roles } = useAuthStore();
  const allowedRoles = PATH_POLICIES[path] || [];
  
  // If no policy exists for the path, allow access
  if (allowedRoles.length === 0) {
    return true;
  }
  
  return useAuthStore.getState().hasRole(allowedRoles);
};

/**
 * Helper function to check if a user has required roles
 * 
 * @param userRoles - Array of user roles
 * @param allowedRoles - Single role or array of roles to check against
 * @returns boolean indicating if the user has the required roles
 */
export const hasRole = (userRoles: UserRole[], allowedRoles: UserRole | UserRole[]): boolean => {
  // Super admin has all roles
  if (userRoles.includes(RBAC.superAdmins[0])) {
    return true;
  }
  
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return rolesToCheck.some(role => userRoles.includes(role));
}; 