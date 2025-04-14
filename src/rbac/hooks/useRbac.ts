
import { useCallback } from 'react';
import { useRbacStore } from '../store/rbac.store';
import { UserRole } from '../constants/roles';
import { Permission } from '../constants/permissions';
import { RBACBridge } from '../bridge';

/**
 * Hook for accessing RBAC functionality in components
 */
export function useRbac() {
  const roles = useRbacStore(state => state.roles);
  const permissions = useRbacStore(state => state.permissions);
  
  /**
   * Check if user has the specified role(s)
   */
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  }, []);
  
  /**
   * Check if user has the specified permission
   */
  const hasPermission = useCallback((permission: Permission): boolean => {
    return RBACBridge.hasPermission(permission);
  }, []);
  
  /**
   * Check if user has admin access
   */
  const hasAdminAccess = useCallback((): boolean => {
    return RBACBridge.hasAdminAccess();
  }, []);
  
  /**
   * Check if user is a super admin
   */
  const isSuperAdmin = useCallback((): boolean => {
    return RBACBridge.isSuperAdmin();
  }, []);
  
  /**
   * Check if user is a moderator
   */
  const isModerator = useCallback((): boolean => {
    return RBACBridge.isModerator();
  }, []);
  
  /**
   * Check if user is a builder
   */
  const isBuilder = useCallback((): boolean => {
    return RBACBridge.isBuilder();
  }, []);
  
  /**
   * Check if user can access a specific route
   */
  const canAccessRoute = useCallback((route: string): boolean => {
    return RBACBridge.canAccessRoute(route);
  }, []);
  
  /**
   * Check if user can access a specific admin section
   */
  const canAccessAdminSection = useCallback((section: string): boolean => {
    return RBACBridge.canAccessAdminSection(section);
  }, []);
  
  return {
    roles,
    permissions,
    hasRole,
    hasPermission,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    canAccessRoute,
    canAccessAdminSection
  };
}
