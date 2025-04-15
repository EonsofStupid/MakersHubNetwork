
import { useCallback } from 'react';
import { RBACBridge } from '@/rbac/bridge';
import { UserRole } from '@/shared/types/core/auth.types';

export interface IRBACHook {
  roles: UserRole[];
  hasRole: (role: UserRole | UserRole[]) => boolean;
  can: (permission: string) => boolean;
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
}

/**
 * Hook for accessing RBAC functionality
 * @returns Object with RBAC methods and state
 */
export const useRbac = (): IRBACHook => {
  const roles = RBACBridge.getRoles();
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  }, []);
  
  // Check if user has a specific permission
  const can = useCallback((permission: string): boolean => {
    return RBACBridge.hasPermission(permission);
  }, []);
  
  // Check if user has admin access
  const hasAdminAccess = useCallback((): boolean => {
    return RBACBridge.hasAdminAccess();
  }, []);
  
  // Check if user is a super admin
  const isSuperAdmin = useCallback((): boolean => {
    return RBACBridge.isSuperAdmin();
  }, []);
  
  // Check if user is a moderator
  const isModerator = useCallback((): boolean => {
    return RBACBridge.isModerator();
  }, []);
  
  // Check if user is a builder
  const isBuilder = useCallback((): boolean => {
    return RBACBridge.isBuilder();
  }, []);
  
  return {
    roles,
    hasRole,
    can,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder
  };
};
