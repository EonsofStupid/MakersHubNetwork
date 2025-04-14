
import { useEffect, useCallback, useState } from 'react';
import { RBACBridge } from '@/bridges/RBACBridge';
import { UserRole, ROLES, Permission } from '@/shared/types';
import { useAuthStore } from '@/stores/auth/auth.store';

/**
 * Hook to use RBAC (Role-Based Access Control) functionality
 */
export function useRbac() {
  // Get the roles from the RBAC bridge
  const [roles, setRoles] = useState<UserRole[]>(RBACBridge.getRoles());
  
  // Get auth state from auth store
  const authUser = useAuthStore(state => state.user);
  const userRoles = useAuthStore(state => state.roles);
  
  // Sync roles from auth store to RBAC bridge
  useEffect(() => {
    if (userRoles.length > 0) {
      RBACBridge.setRoles(userRoles);
      setRoles(userRoles);
    } else if (authUser && authUser.roles) {
      RBACBridge.setRoles(authUser.roles);
      setRoles(authUser.roles);
    }
  }, [authUser, userRoles]);
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  }, []);
  
  // Check if user has a specific permission
  const can = useCallback((permission: Permission): boolean => {
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
  
  // Map of role constants
  const ROLE_CONSTANTS = {
    USER: ROLES.USER,
    ADMIN: ROLES.ADMIN,
    SUPER_ADMIN: ROLES.SUPER_ADMIN,
    MODERATOR: ROLES.MODERATOR,
    BUILDER: ROLES.BUILDER,
    GUEST: ROLES.GUEST,
  };
  
  return {
    roles,
    hasRole,
    can,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    ROLES: ROLE_CONSTANTS
  };
}
