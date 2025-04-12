
import { useCallback } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/shared/types/shared.types';

/**
 * Hook to check if the current user has a specific role
 * @param role The role or roles to check for
 * @returns Boolean indicating if the user has the role
 */
export function useHasRole(role: UserRole | UserRole[]) {
  const roles = useAuthStore(state => state.roles);
  
  return useCallback(() => {
    if (!roles.length) {
      return false;
    }
    
    // Super admin has all roles
    if (roles.includes('super_admin')) {
      return true;
    }
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  }, [roles, role]);
}

/**
 * Hook to check if the user has admin-level access
 * @returns Boolean indicating if the user has admin access
 */
export function useHasAdminAccess() {
  const hasRole = useAuthStore(state => state.hasRole);
  
  return useCallback(() => {
    return hasRole(['admin', 'super_admin']);
  }, [hasRole]);
}

/**
 * Hook to check if the user is a super admin
 * @returns Boolean indicating if the user is a super admin
 */
export function useIsSuperAdmin() {
  const hasRole = useAuthStore(state => state.hasRole);
  
  return useCallback(() => {
    return hasRole('super_admin');
  }, [hasRole]);
}
