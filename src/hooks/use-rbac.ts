
import { useCallback, useMemo } from 'react';
import { useRbacStore } from '@/rbac/store';
import { IRBACHook } from '@/rbac/types';
import { UserRole } from '@/shared/types/shared.types';

/**
 * Hook for accessing RBAC functionality
 * @returns Object with RBAC methods and state
 */
export const useRbac = (): IRBACHook => {
  const { roles, hasRole: storeHasRole, hasPermission } = useRbacStore();
  
  // Memoize the hasRole function to prevent unnecessary re-renders
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return storeHasRole(role);
  }, [storeHasRole]);
  
  // Check if user has a specific permission
  const can = useCallback((permission: string): boolean => {
    return hasPermission(permission);
  }, [hasPermission]);
  
  // Check if user has admin access
  const hasAdminAccess = useCallback((): boolean => {
    return hasRole(['admin', 'super_admin']);
  }, [hasRole]);
  
  // Check if user is a super admin
  const isSuperAdmin = useCallback((): boolean => {
    return hasRole('super_admin');
  }, [hasRole]);
  
  // Check if user is a moderator
  const isModerator = useCallback((): boolean => {
    return hasRole('moderator');
  }, [hasRole]);
  
  // Check if user is a builder
  const isBuilder = useCallback((): boolean => {
    return hasRole('builder');
  }, [hasRole]);
  
  return useMemo(() => ({
    roles,
    hasRole,
    can,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder
  }), [roles, hasRole, can, hasAdminAccess, isSuperAdmin, isModerator, isBuilder]);
};
