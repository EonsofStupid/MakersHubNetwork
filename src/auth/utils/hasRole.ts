import { authBridge } from '@/bridges/AuthBridge';
import { UserRole } from '@/shared/types';

/**
 * Utility to check if the current user has a specific role
 * @param role The role or roles to check
 * @returns Boolean indicating if the user has the required role
 */
export function hasRole(role: UserRole | UserRole[]): boolean {
  if (!role) return false;
  
  // If checking for admin roles, use the specialized methods
  if (role === 'admin') {
    return authBridge.isAdmin();
  }
  
  if (role === 'super_admin') {
    return authBridge.isSuperAdmin();
  }
  
  // Otherwise, use the general hasRole method
  return authBridge.hasRole(role);
}
