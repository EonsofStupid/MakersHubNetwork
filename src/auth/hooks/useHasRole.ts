
import { useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '@/shared/types/shared.types';

/**
 * Hook to check if the current user has a specific role or roles
 */
export function useHasRole() {
  const { roles } = useAuthStore();

  /**
   * Checks if the user has the required role(s)
   * @param requiredRole - A single role or array of roles to check
   * @returns boolean indicating if user has any of the required roles
   */
  const hasRole = useCallback((requiredRole: UserRole | UserRole[]): boolean => {
    if (!roles || roles.length === 0) {
      return false;
    }

    if (Array.isArray(requiredRole)) {
      // Check if user has any of the required roles
      return requiredRole.some(role => roles.includes(role));
    }

    // Check for a single role
    return roles.includes(requiredRole);
  }, [roles]);

  /**
   * Checks if the user has admin access (ADMIN or SUPER_ADMIN roles)
   * @returns boolean indicating if user has admin access
   */
  const hasAdminAccess = useCallback((): boolean => {
    return hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  }, [hasRole]);

  /**
   * Checks if the user is a super admin
   * @returns boolean indicating if user is a super admin
   */
  const isSuperAdmin = useCallback((): boolean => {
    return hasRole(UserRole.SUPER_ADMIN);
  }, [hasRole]);

  return { hasRole, hasAdminAccess, isSuperAdmin };
}
