import { useCallback } from 'react';
import { UserRole } from '@/shared/types/SharedTypes';
import { useAuthStore } from '@/stores/auth/auth.store';
import * as rbac from './rbac';
import { AdminSection, RBACHook } from './types/RBACTypes';

/**
 * Hook for role-based access control
 * This hook provides a clean interface to RBAC functionality
 * while maintaining separation from authentication implementation
 */
export function useRbac(): RBACHook {
  // Get roles from auth store - this is the only coupling point
  const roles = useAuthStore(state => state.roles);
  
  // Wrap RBAC functions to use current user's roles
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    return rbac.hasRole(roles, role);
  }, [roles]);
  
  const hasAdminAccess = useCallback(() => {
    return rbac.hasAdminAccess(roles);
  }, [roles]);
  
  const isSuperAdmin = useCallback(() => {
    return rbac.isSuperAdmin(roles);
  }, [roles]);
  
  const isModerator = useCallback(() => {
    return rbac.isModerator(roles);
  }, [roles]);
  
  const isBuilder = useCallback(() => {
    return rbac.isBuilder(roles);
  }, [roles]);
  
  const getHighestRole = useCallback(() => {
    return rbac.getHighestRole(roles);
  }, [roles]);
  
  const hasElevatedPrivileges = useCallback(() => {
    return rbac.hasElevatedPrivileges(roles);
  }, [roles]);
  
  const canAccessAdminSection = useCallback((section: AdminSection) => {
    return rbac.canAccessAdminSection(roles, section);
  }, [roles]);
  
  const getRoleLabels = useCallback(() => {
    return rbac.getRoleLabels();
  }, []);
  
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