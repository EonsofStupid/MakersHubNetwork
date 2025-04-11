
/**
 * useHasRole.ts
 * 
 * Hook to check if the current user has specific roles
 * Uses AuthBridge to ensure consistent role checking across the application
 */

import { useCallback } from 'react';
import { UserRole } from '@/types/shared';
import { AuthBridge } from '@/bridges/AuthBridge';

/**
 * Hook to check if the current user has a specific role
 * @param role Role or roles to check
 * @returns Boolean indicating if user has the role
 */
export function useHasRole(role: UserRole | UserRole[]) {
  return AuthBridge.hasRole(role);
}

/**
 * Hook to check if the current user has admin access
 * @returns Boolean indicating if user has admin access
 */
export function useHasAdminAccess() {
  return AuthBridge.isAdmin();
}

/**
 * Hook to check if the current user is a super admin
 * @returns Boolean indicating if user is a super admin
 */
export function useIsSuperAdmin() {
  return AuthBridge.isSuperAdmin();
}

/**
 * Hook to check multiple roles at once
 * @returns Object with role checking functions
 */
export function useRoleChecks() {
  const hasRole = useCallback((checkRole: UserRole | UserRole[]) => {
    return AuthBridge.hasRole(checkRole);
  }, []);
  
  const isAdmin = AuthBridge.isAdmin();
  const isSuperAdmin = AuthBridge.isSuperAdmin();
  
  return {
    hasRole,
    isAdmin,
    isSuperAdmin,
    hasAdminAccess: isAdmin || isSuperAdmin
  };
}
