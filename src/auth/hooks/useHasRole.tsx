
import { useCallback } from 'react';
import { useRbac } from '@/auth/rbac/use-rbac';
import { UserRole, ROLES } from '@/shared/types/shared.types';

/**
 * Hook to check if the current user has a specific role
 * @param role The role to check for
 * @returns Boolean indicating if the user has the role
 */
export function useHasRole(role: UserRole | UserRole[]) {
  const { hasRole } = useRbac();
  
  return useCallback(() => {
    return hasRole(role);
  }, [hasRole, role]);
}

/**
 * Hook to check if the current user is an admin
 * @returns Boolean indicating if the user is an admin
 */
export function useIsAdmin() {
  const { hasRole } = useRbac();
  
  return useCallback(() => {
    return hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }, [hasRole]);
}

/**
 * Hook to check if the current user is a super admin
 * @returns Boolean indicating if the user is a super admin
 */
export function useIsSuperAdmin() {
  const { hasRole } = useRbac();
  
  return useCallback(() => {
    return hasRole(ROLES.SUPER_ADMIN);
  }, [hasRole]);
}

/**
 * Hook to check if the current user is a moderator
 * @returns Boolean indicating if the user is a moderator
 */
export function useIsModerator() {
  const { hasRole } = useRbac();
  
  return useCallback(() => {
    return hasRole([ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }, [hasRole]);
}

/**
 * Hook to check if the current user is a builder
 * @returns Boolean indicating if the user is a builder
 */
export function useIsBuilder() {
  const { hasRole } = useRbac();
  
  return useCallback(() => {
    return hasRole([ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }, [hasRole]);
}
