
import { useEffect, useCallback, useState } from 'react';
import { RBACBridge } from '@/rbac';
import { UserRole, ROLES } from '@/rbac/constants/roles';
import { Permission } from '@/shared/types/permissions';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Hook to use RBAC (Role-Based Access Control) functionality
 * Enterprise-level implementation with caching and change detection
 */
export function useRbac() {
  // Get the roles from the RBAC bridge
  const [roles, setRoles] = useState<UserRole[]>(RBACBridge.getRoles());
  
  // Get auth state from auth store
  const authUser = useAuthStore(state => state.user);
  const userRoles = useAuthStore(state => state.roles);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // Sync roles from auth store to RBAC bridge
  useEffect(() => {
    if (userRoles?.length > 0) {
      RBACBridge.setRoles(userRoles);
      setRoles(userRoles);
    } else if (authUser?.app_metadata?.roles) {
      const metadataRoles = authUser.app_metadata.roles as UserRole[];
      RBACBridge.setRoles(metadataRoles);
      setRoles(metadataRoles);
    }
    
    // Keep local state in sync with bridge
    const interval = setInterval(() => {
      const currentRoles = RBACBridge.getRoles();
      if (JSON.stringify(currentRoles) !== JSON.stringify(roles)) {
        setRoles(currentRoles);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [authUser, userRoles, roles]);
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  }, []);
  
  // Check if user has a specific permission
  const hasPermission = useCallback((permission: Permission): boolean => {
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
  
  // Check if auth is ready and user is authenticated
  const isAuthReady = useCallback((): boolean => {
    return isAuthenticated;
  }, [isAuthenticated]);
  
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
    hasPermission,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    isAuthReady,
    ROLES: ROLE_CONSTANTS
  };
}
