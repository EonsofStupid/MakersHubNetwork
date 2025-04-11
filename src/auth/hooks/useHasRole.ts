import { useCallback } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { UserRole } from '@/shared/types';

/**
 * Hook to check if the current user has a specific role
 * @param role The role or roles to check
 * @returns Boolean indicating if the user has the required role
 */
export function useHasRole(role?: UserRole | UserRole[]) {
  const hasRole = useCallback((roleToCheck: UserRole | UserRole[]) => {
    if (!roleToCheck) return false;
    
    // If checking for admin roles, use the specialized methods
    if (roleToCheck === 'admin') {
      return authBridge.isAdmin();
    }
    
    if (roleToCheck === 'super_admin') {
      return authBridge.isSuperAdmin();
    }
    
    // Otherwise, use the general hasRole method
    return authBridge.hasRole(roleToCheck);
  }, []);
  
  // If a specific role was provided when calling the hook, 
  // immediately check for that role
  const initialCheck = role ? hasRole(role) : false;
  
  return { 
    hasRole, 
    isAdmin: authBridge.isAdmin(),
    isSuperAdmin: authBridge.isSuperAdmin(),
    initialCheck 
  };
}
