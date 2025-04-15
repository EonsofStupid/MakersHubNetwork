
import { ROLES, UserRole } from '@/shared/types/shared.types';
import { useRBACStore } from './rbac.store';

/**
 * RBAC bridge for checking roles and permissions
 */
export class RBACBridge {
  /**
   * Check if the user has a role
   * @param role Role or roles to check
   * @returns boolean
   */
  static hasRole(role: UserRole | UserRole[]): boolean {
    return useRBACStore.getState().hasRole(role);
  }

  /**
   * Check if the user has admin access
   * @returns boolean
   */
  static hasAdminAccess(): boolean {
    return useRBACStore.getState().hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  /**
   * Check if the user has a permission
   * @param permission Permission to check
   * @returns boolean
   */
  static hasPermission(permission: string): boolean {
    return useRBACStore.getState().hasPermission(permission);
  }

  /**
   * Get all user roles
   * @returns UserRole[]
   */
  static getUserRoles(): UserRole[] {
    return useRBACStore.getState().userRoles;
  }

  /**
   * Get all user permissions
   * @returns string[]
   */
  static getUserPermissions(): string[] {
    return useRBACStore.getState().permissions;
  }
}
