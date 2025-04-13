
import { useCallback } from 'react';
import { UserRole } from '@/shared/types/shared.types';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Hook to check if user has specific roles
 */
export const useHasRole = () => {
  const roles = useAuthStore(state => state.roles);
  
  /**
   * Check if user has the specified role(s)
   */
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (!roles || roles.length === 0) return false;
    
    // Superadmin has all roles
    if (roles.includes('superadmin')) return true;
    
    // Check for specific roles
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  }, [roles]);

  /**
   * Check if user has admin access (admin or superadmin)
   */
  const hasAdminAccess = useCallback(() => {
    return hasRole(['admin', 'superadmin']);
  }, [hasRole]);

  /**
   * Check if user is superadmin
   */
  const isSuperAdmin = useCallback(() => {
    return hasRole('superadmin');
  }, [hasRole]);
  
  return {
    hasRole,
    hasAdminAccess,
    isSuperAdmin
  };
};
