import { useRbacStore } from '@/stores/rbacStore';
import { UserRole, Permission, ROLES, RBAC_POLICIES } from '@/types/shared';

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
   * Check if user has the specified permission
   */
  can: (permission: Permission): boolean => {
    return useRbacStore.getState().can(permission);
  },
  
  /**
   * Check if user can access the specified route
   */
  canAccessRoute: (route: string): boolean => {
    const { roles } = useRbacStore.getState();
    const allowedRoles = RBAC_POLICIES[route] || [];
    return roles.some(role => allowedRoles.includes(role));
  },
  
  /**
   * Set user roles
   */
  setRoles: (roles: UserRole[]): void => {
    useRbacStore.getState().setRoles(roles);
  },
  
  /**
   * Set user permissions
   */
  setPermissions: (permissions: Record<Permission, boolean>): void => {
    useRbacStore.getState().setPermissions(permissions);
  },
  
  /**
   * Clear RBAC state
   */
  clear: (): void => {
    useRbacStore.getState().clear();
  },
  
  /**
   * Check if user is admin
   */
  isAdmin: (): boolean => {
    return useRbacStore.getState().hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  },
  
  /**
   * Check if user is super admin
   */
  isSuperAdmin: (): boolean => {
    return useRbacStore.getState().hasRole(ROLES.SUPER_ADMIN);
  },
  
  /**
   * Check if user is moderator
   */
  isModerator: (): boolean => {
    return useRbacStore.getState().hasRole([ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  },
  
  /**
   * Check if user is builder
   */
  isBuilder: (): boolean => {
    return useRbacStore.getState().hasRole([ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }
}; 