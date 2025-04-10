
import { useAuthStore } from '../store/auth.store';
import { useMemo } from 'react';
import { UserRole, ROLES } from '@/types/shared';
import { AuthBridge } from '@/bridges/AuthBridge';

/**
 * Hook to check if the current user has any of the specified roles
 * @param role Role or array of roles to check
 * @returns Boolean indicating if user has at least one of the specified roles
 */
export function useHasRole(role: UserRole | UserRole[]): boolean {
  const roles = useAuthStore(state => state.roles);
  
  return useMemo(() => {
    // Use AuthBridge for consistent behavior
    return AuthBridge.hasRole(role);
  }, [role, roles]);
}

/**
 * Hook to check if the current user has admin access
 * @returns Boolean indicating if user has admin access
 */
export function useHasAdminAccess(): boolean {
  const roles = useAuthStore(state => state.roles);
  
  return useMemo(() => {
    // Use AuthBridge for consistent behavior
    return AuthBridge.isAdmin();
  }, [roles]);
}

/**
 * Hook to check if the current user is a super admin
 * @returns Boolean indicating if user is a super admin
 */
export function useIsSuperAdmin(): boolean {
  const roles = useAuthStore(state => state.roles);
  
  return useMemo(() => {
    // Use AuthBridge for consistent behavior
    return AuthBridge.isSuperAdmin();
  }, [roles]);
}
