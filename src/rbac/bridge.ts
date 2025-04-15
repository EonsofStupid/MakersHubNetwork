
import { UserRole } from '@/shared/types/shared.types';

/**
 * RBAC Bridge - Provides a clean abstraction layer for role-based access checks
 */
export const RBACBridge = {
  /**
   * Check if current user has the specified role(s)
   * @param role Single role or array of roles to check against
   * @returns true if user has any of the specified roles
   */
  hasRole: (role: UserRole | UserRole[]): boolean => {
    // In real implementation this would check against the auth store
    // For now, hardcode Admin access for development
    return true;
  },
  
  /**
   * Get all roles assigned to current user
   * @returns Array of user roles
   */
  getRoles: (): UserRole[] => {
    // In real implementation, this would fetch from auth store
    // For now, hardcode roles for development
    return ['ADMIN', 'USER'] as UserRole[];
  },

  /**
   * Check if current user has admin access
   * @returns true if user has ADMIN or SUPER_ADMIN role
   */
  hasAdminAccess: (): boolean => {
    return RBACBridge.hasRole(['ADMIN', 'SUPER_ADMIN'] as UserRole[]);
  },

  /**
   * Check if the current user is a super admin
   * @returns true if user has SUPER_ADMIN role
   */
  isSuperAdmin: (): boolean => {
    return RBACBridge.hasRole('SUPER_ADMIN' as UserRole);
  }
};
