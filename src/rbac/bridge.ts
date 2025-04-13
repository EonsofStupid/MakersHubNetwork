
import { useRbacStore } from './store';
import { UserRole } from '@/shared/types/SharedTypes';

/**
 * RBACBridge
 * Provides a clean interface for components to interact with RBAC state
 * without directly accessing Zustand
 */
export const RBACBridge = {
  /**
   * Get current user roles
   */
  getRoles: (): UserRole[] => {
    return useRbacStore.getState().roles;
  },
  
  /**
   * Check if user has the specified role(s)
   */
  hasRole: (check: UserRole | UserRole[]): boolean => {
    return useRbacStore.getState().hasRole(check);
  },
  
  /**
   * Check if user has admin access
   */
  hasAdminAccess: (): boolean => {
    return useRbacStore.getState().hasRole(['admin', 'superadmin']);
  },
  
  /**
   * Check if user is super admin
   */
  isSuperAdmin: (): boolean => {
    return useRbacStore.getState().hasRole('superadmin');
  },
  
  /**
   * Set user roles
   */
  setRoles: (roles: UserRole[]): void => {
    useRbacStore.getState().setRoles(roles);
  },
  
  /**
   * Clear roles
   */
  clearRoles: (): void => {
    useRbacStore.getState().clear();
  }
};
