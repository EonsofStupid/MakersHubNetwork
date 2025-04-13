
import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { UserRole } from '@/shared/types/shared.types';

interface UseHasRoleProps {
  role?: UserRole | UserRole[];
  defaultValue?: boolean;
}

/**
 * Hook to check if the current user has a specific role or roles
 * @param options Options for the hook
 * @returns Whether the user has the specified role(s)
 */
export function useHasRole(options?: UseHasRoleProps): boolean {
  const { hasRole, isAuthenticated, isSuperAdmin } = useAuth();
  const { role, defaultValue = false } = options || {};
  
  const checkRole = useCallback((): boolean => {
    // No role specified or not authenticated
    if (!role || !isAuthenticated) {
      return defaultValue;
    }
    
    // Super admins have all roles
    if (isSuperAdmin) {
      return true;
    }
    
    // Check specific role(s)
    return hasRole(role);
  }, [role, hasRole, isAuthenticated, isSuperAdmin, defaultValue]);

  return checkRole();
}
