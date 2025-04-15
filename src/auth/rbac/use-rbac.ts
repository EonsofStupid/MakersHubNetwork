
import { useEffect, useCallback, useState } from 'react';
import { RBACBridge } from '@/bridges/RBACBridge';
import { UserRole, ROLES } from '@/shared/types/core/auth.types';
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
    if (userRoles && userRoles.length > 0) {
      const typedRoles = userRoles.filter((role): role is UserRole => 
        Object.values(ROLES).includes(role as UserRole));
      RBACBridge.setRoles(typedRoles);
      setRoles(typedRoles);
    } else if (authUser && authUser.roles) {
      const typedRoles = authUser.roles.filter((role): role is UserRole => 
        Object.values(ROLES).includes(role as UserRole));
      RBACBridge.setRoles(typedRoles);
      setRoles(typedRoles);
    }
  }, [authUser, userRoles]);
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
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
    user: ROLES.user,
    admin: ROLES.admin,
    super_admin: ROLES.super_admin,
    moderator: ROLES.moderator,
    builder: ROLES.builder,
    guest: ROLES.guest,
  };
  
  return {
    roles,
    hasRole,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    ROLES: ROLE_CONSTANTS
  };
}
