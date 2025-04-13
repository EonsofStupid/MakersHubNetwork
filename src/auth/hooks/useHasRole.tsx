
import { useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '@/shared/types/shared.types';

interface UseHasRoleOptions {
  role?: UserRole | UserRole[];
  defaultValue?: boolean;
}

/**
 * Hook to check if the current user has a specific role or roles
 * @param options Options for the hook
 * @returns An object with hasRole function and hasAdminAccess boolean
 */
export function useHasRole(options?: UseHasRoleOptions) {
  const { roles, isAuthenticated } = useAuthStore();
  const { role, defaultValue = false } = options || {};
  
  const hasRole = useCallback((roleToCheck: UserRole | UserRole[]): boolean => {
    // Not authenticated
    if (!isAuthenticated) {
      return false;
    }
    
    // Super admins have all roles
    if (roles.includes(UserRole.SUPERADMIN)) {
      return true;
    }
    
    // Check specific role(s)
    if (Array.isArray(roleToCheck)) {
      return roleToCheck.some(r => roles.includes(r));
    }
    
    return roles.includes(roleToCheck);
  }, [roles, isAuthenticated]);

  // Derived convenience methods
  const hasAdminAccess = useCallback((): boolean => {
    return hasRole([UserRole.ADMIN, UserRole.SUPERADMIN]);
  }, [hasRole]);

  const hasModerationAccess = useCallback((): boolean => {
    return hasRole([UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPERADMIN]);
  }, [hasRole]);

  const checkRole = useCallback((): boolean => {
    if (!role) {
      return defaultValue;
    }
    return hasRole(role);
  }, [role, hasRole, defaultValue]);

  return {
    hasRole,
    hasAdminAccess,
    hasModerationAccess,
    check: checkRole()
  };
}
