
import { useMemo } from 'react';
import { AuthBridge } from '@/bridges';
import { UserRole } from '@/types/shared';

/**
 * Custom hook to check if the current user has a specific role
 */
export function useHasRole(role: UserRole | UserRole[] | undefined) {
  return useMemo(() => {
    if (!role) return false;
    return AuthBridge.hasRole(role);
  }, [role]);
}

/**
 * Custom hook to check if the current user has admin access
 */
export function useHasAdminAccess() {
  return useMemo(() => {
    return AuthBridge.isAdmin();
  }, []);
}

/**
 * Custom hook to check if the current user is a super admin
 */
export function useIsSuperAdmin() {
  return useMemo(() => {
    return AuthBridge.isSuperAdmin();
  }, []);
}
