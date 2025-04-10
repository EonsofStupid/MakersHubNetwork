
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types/roles';
import { useMemo } from 'react';

/**
 * Hook to check if the current user has any of the specified roles
 * @param role Role or array of roles to check
 * @returns Boolean indicating if user has at least one of the specified roles
 */
export function useHasRole(role: UserRole | UserRole[] | string | string[]) {
  const roles = useAuthStore((state) => state.roles);
  
  return useMemo(() => {
    // Handle string roles for backward compatibility
    if (typeof role === 'string') {
      return roles.includes(role);
    }
    
    // Handle array of roles (either enum or string)
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return false;
  }, [roles, role]);
}

/**
 * Hook to check if the current user has admin access
 * @returns Boolean indicating if user has admin access
 */
export function useHasAdminAccess() {
  return useHasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
}

/**
 * Hook to check if the current user is a super admin
 * @returns Boolean indicating if user is a super admin
 */
export function useIsSuperAdmin() {
  return useHasRole(UserRole.SUPER_ADMIN);
}
