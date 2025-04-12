
import { useAuthStore } from '@/auth/store/auth.store';
import { useCallback } from 'react';
import { UserRole } from '@/shared/types/shared.types';

/**
 * Hook to check if a user has a specific role
 */
export const useHasRole = (role: UserRole | UserRole[]) => {
  const roles = useAuthStore(state => state.roles);
  
  return useCallback(() => {
    if (!roles || roles.length === 0) return false;
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  }, [roles, role]);
};

/**
 * Hook to check if a user has admin access
 */
export const useHasAdminAccess = () => {
  const roles = useAuthStore(state => state.roles);
  
  return useCallback(() => {
    if (!roles || roles.length === 0) return false;
    return roles.includes('admin') || roles.includes('super_admin');
  }, [roles]);
};

/**
 * Hook to check if a user is a super admin
 */
export const useIsSuperAdmin = () => {
  const roles = useAuthStore(state => state.roles);
  
  return useCallback(() => {
    if (!roles || roles.length === 0) return false;
    return roles.includes('super_admin');
  }, [roles]);
};
