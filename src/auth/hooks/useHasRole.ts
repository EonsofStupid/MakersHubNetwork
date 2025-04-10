
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types/roles';
import { useMemo } from 'react';

/**
 * Hook to check if the current user has any of the specified roles
 * @param role Role or array of roles to check
 * @returns Boolean indicating if user has at least one of the specified roles
 */
export function useHasRole(role: UserRole | UserRole[]): boolean {
  const roles = useAuthStore((state) => state.roles);
  
  return useMemo(() => {    
    // Handle array of roles
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    // Handle single role
    return roles.includes(role);
  }, [roles, role]);
}

/**
 * Hook to check if the current user has admin access
 * @returns Boolean indicating if user has admin access
 */
export function useHasAdminAccess(): boolean {
  return useHasRole(['admin', 'super_admin']);
}

/**
 * Hook to check if the current user is a super admin
 * @returns Boolean indicating if user is a super admin
 */
export function useIsSuperAdmin(): boolean {
  return useHasRole('super_admin');
}
