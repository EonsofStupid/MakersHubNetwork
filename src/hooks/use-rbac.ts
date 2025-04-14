
import { UserRole, RBAC } from '@/shared/types';
import { useRbac } from '@/auth/rbac/use-rbac';

// Define the PATH_POLICIES as a value rather than just a type
export const PATH_POLICIES = {
  '/admin': [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/admin/users': [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/admin/roles': [UserRole.SUPER_ADMIN] as UserRole[],
  '/admin/permissions': [UserRole.SUPER_ADMIN] as UserRole[],
  '/admin/analytics': [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/projects/create': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/projects/edit': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  '/projects/delete': [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
};

/**
 * Custom hook for role-based access control
 * 
 * @param allowedRoles - Single role or array of roles to check against
 * @returns boolean indicating if the current user has the required roles
 */
export const useHasRole = (allowedRoles: UserRole | UserRole[]): boolean => {
  const { hasRole } = useRbac();
  return hasRole(allowedRoles);
};

/**
 * Custom hook to check if the current user has admin privileges
 * 
 * @returns boolean indicating if the current user is an admin or super admin
 */
export const useIsAdmin = (): boolean => {
  const { hasAdminAccess } = useRbac();
  return hasAdminAccess();
};

/**
 * Custom hook to check if the current user has super admin privileges
 * 
 * @returns boolean indicating if the current user is a super admin
 */
export const useIsSuperAdmin = (): boolean => {
  const { isSuperAdmin } = useRbac();
  return isSuperAdmin();
};

/**
 * Custom hook to check if the current user has moderator privileges
 * 
 * @returns boolean indicating if the current user is a moderator, admin, or super admin
 */
export const useIsModerator = (): boolean => {
  const { isModerator } = useRbac();
  return isModerator();
};

/**
 * Custom hook to check if the current user has builder privileges
 * 
 * @returns boolean indicating if the current user is a builder, admin, or super admin
 */
export const useIsBuilder = (): boolean => {
  const { isBuilder } = useRbac();
  return isBuilder();
};

/**
 * Custom hook to check if the current user is authenticated
 * 
 * @returns boolean indicating if the current user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  // Fix reference to auth store
  const { isAuthReady } = useRbac();
  return isAuthReady();
};

/**
 * Custom hook to check if the current user can access a specific path
 * 
 * @param path - The path to check access for
 * @returns boolean indicating if the current user can access the path
 */
export const useCanAccessPath = (path: string): boolean => {
  const { hasRole } = useRbac();
  const allowedRoles = Object.keys(PATH_POLICIES).includes(path) ? 
    PATH_POLICIES[path as keyof typeof PATH_POLICIES] : [];
  
  // If no policy exists for the path, allow access
  if (allowedRoles.length === 0) {
    return true;
  }
  
  return hasRole(allowedRoles);
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
  if (userRoles.includes(UserRole.SUPER_ADMIN)) {
    return true;
  }
  
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return rolesToCheck.some(role => userRoles.includes(role));
};
