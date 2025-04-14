
import { useCallback } from 'react';
import { RBACBridge } from '../bridge';
import { UserRole, ROLES } from '../constants/roles';
import { Permission } from '@/shared/types/permissions';

/**
 * Custom hook for accessing RBAC functionality
 * Provides consistent interface for role-based access control throughout the app
 */
export function useRbac() {
  // Get current roles from RBAC bridge
  const roles = RBACBridge.getRoles();
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  }, []);
  
  // Check if user has a specific permission
  const hasPermission = useCallback((permission: Permission): boolean => {
    return RBACBridge.hasPermission(permission);
  }, []);
  
  // Check if user has all of the specified permissions
  const hasAllPermissions = useCallback((permissions: Permission[]): boolean => {
    return RBACBridge.hasAllPermissions(permissions);
  }, []);
  
  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback((permissions: Permission[]): boolean => {
    return RBACBridge.hasAnyPermission(permissions);
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
  
  // Check if user can access a specific route
  const canAccessRoute = useCallback((route: string): boolean => {
    return RBACBridge.canAccessRoute(route);
  }, []);
  
  // Check if user can access a specific admin section
  const canAccessAdminSection = useCallback((section: string): boolean => {
    return RBACBridge.canAccessAdminSection(section);
  }, []);
  
  // Get highest role for the current user
  const getHighestRole = useCallback((): UserRole => {
    return RBACBridge.getHighestRole();
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
    // State
    roles,
    
    // Role checks
    hasRole,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    getHighestRole,
    
    // Permission checks
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    
    // Route/section access
    canAccessRoute,
    canAccessAdminSection,
    
    // Constants
    ROLES: ROLE_CONSTANTS
  };
}
