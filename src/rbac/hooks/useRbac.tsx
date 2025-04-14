
import { useCallback } from 'react';
import { RBACBridge } from '../bridge';
import { UserRole, Permission } from '@/shared/types/shared.types';

/**
 * Hook to use RBAC functionality
 */
export function useRbac() {
  // Get the roles from the RBAC bridge
  const roles = RBACBridge.getRoles();
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  }, []);
  
  // Check if user has a specific permission
  const hasPermission = useCallback((permission: Permission): boolean => {
    return RBACBridge.hasPermission(permission as any);
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
    hasPermission,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder
  };
}
