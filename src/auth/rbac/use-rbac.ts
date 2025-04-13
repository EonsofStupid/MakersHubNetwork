
import { useCallback } from 'react';
import { UserRole } from '@/shared/types/shared.types';
import { useAuthStore } from '@/auth/store/auth.store';
import * as rbac from './rbac';
import { RBACBridge } from '@/rbac/bridge';

/**
 * Hook for role-based access control
 * This hook provides a clean interface to RBAC functionality
 */
export function useRbac() {
  // Get the hasRole function from RBACBridge
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    return RBACBridge.hasRole(role);
  }, []);
  
  // Get the hasAdminAccess function from RBACBridge
  const hasAdminAccess = useCallback(() => {
    return RBACBridge.hasAdminAccess();
  }, []);
  
  // Get the isSuperAdmin function from RBACBridge
  const isSuperAdmin = useCallback(() => {
    return RBACBridge.isSuperAdmin();
  }, []);
  
  // Get the isModerator function from RBACBridge
  const isModerator = useCallback(() => {
    return RBACBridge.isModerator();
  }, []);
  
  // Get the isBuilder function from RBACBridge
  const isBuilder = useCallback(() => {
    return RBACBridge.isBuilder();
  }, []);
  
  // Get the getHighestRole function
  const getHighestRole = useCallback(() => {
    const roles = RBACBridge.getRoles();
    return rbac.getHighestRole(roles);
  }, []);
  
  // Get the hasElevatedPrivileges function
  const hasElevatedPrivileges = useCallback(() => {
    return hasAdminAccess();
  }, [hasAdminAccess]);
  
  // Get the canAccessAdminSection function
  const canAccessAdminSection = useCallback((section: string) => {
    return RBACBridge.canAccessAdminSection(section);
  }, []);
  
  // Get the getRoleLabels function
  const getRoleLabels = useCallback(() => {
    return rbac.getRoleLabels();
  }, []);
  
  // Get the roles from the RBAC bridge
  const roles = RBACBridge.getRoles();
  
  return {
    hasRole,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    getHighestRole,
    hasElevatedPrivileges,
    canAccessAdminSection,
    getRoleLabels,
    roles
  };
}
