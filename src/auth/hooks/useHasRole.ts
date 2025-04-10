
/**
 * auth/hooks/useHasRole.ts
 * 
 * Custom hooks for role-based access control
 * These utilize the AuthBridge for consistent behavior
 */

import { useCallback } from 'react';
import { UserRole } from '@/types/shared';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthBridge } from '@/bridges/AuthBridge';

/**
 * Check if the current user has a specific role
 * @param role Single role or array of roles to check against
 * @returns Boolean indicating if user has the role
 */
export function useHasRole(role: UserRole | UserRole[]): boolean {
  const roles = useAuthStore(state => state.roles);
  
  if (Array.isArray(role)) {
    return role.some(r => roles.includes(r));
  }
  
  return roles.includes(role);
}

/**
 * Check if the current user has admin access (admin or super_admin)
 * @returns Boolean indicating if user has admin access
 */
export function useHasAdminAccess(): boolean {
  return AuthBridge.isAdmin();
}

/**
 * Check if the current user is a super admin
 * @returns Boolean indicating if user is a super admin
 */
export function useIsSuperAdmin(): boolean {
  return AuthBridge.isSuperAdmin();
}

/**
 * Get a role checking function that can be used in callbacks
 * @returns Function that checks if user has a specific role
 */
export function useRoleChecker() {
  return useCallback((role: UserRole | UserRole[]): boolean => {
    return AuthBridge.hasRole(role);
  }, []);
}
