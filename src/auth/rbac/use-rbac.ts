
import { useCallback } from 'react';
import { UserRole, Permission } from '@/shared/types/shared.types';
import { useAuthStore } from '@/auth/store/auth.store';
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
  
  // Get the hasPermission function
  const hasPermission = useCallback((permission: Permission) => {
    return RBACBridge.hasPermission(permission);
  }, []);
  
  // Get the getHighestRole function
  const getHighestRole = useCallback(() => {
    return RBACBridge.getHighestRole();
  }, []);
  
  // Get the hasElevatedPrivileges function
  const hasElevatedPrivileges = useCallback(() => {
    return hasAdminAccess();
  }, [hasAdminAccess]);
  
  // Get the canAccessAdminSection function
  const canAccessSection = useCallback((section: string) => {
    return RBACBridge.canAccessAdminSection(section);
  }, []);
  
  // Get the getRoleLabels function
  const getRoleLabels = useCallback(() => {
    const roles = {
      [UserRole.USER]: "User",
      [UserRole.ADMIN]: "Admin",
      [UserRole.SUPER_ADMIN]: "Super Admin",
      [UserRole.MODERATOR]: "Moderator",
      [UserRole.BUILDER]: "Builder",
      [UserRole.GUEST]: "Guest"
    };
    return roles;
  }, []);
  
  // Get the roles from the RBAC bridge
  const roles = RBACBridge.getRoles();
  
  return {
    hasRole,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    hasPermission,
    getHighestRole,
    hasElevatedPrivileges,
    canAccessSection,
    getRoleLabels,
    roles
  };
}
