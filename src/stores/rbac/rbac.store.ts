import { create } from 'zustand';
import { UserRole, ROLES } from '@/shared/types/shared.types';
import { hasRole as rbacHasRole } from '@/auth/rbac/rbac';

/**
 * RBAC store state interface
 */
interface RBACState {
  roles: UserRole[];
  permissions: Record<string, boolean>;
  hasRole: (check: UserRole | UserRole[]) => boolean;
  can: (action: string) => boolean;
  setRoles: (roles: UserRole[]) => void;
  setPermissions: (permissions: Record<string, boolean>) => void;
  clear: () => void;
}

/**
 * RBAC store implementation
 * Handles role-based access control separately from authentication
 */
export const useRbacStore = create<RBACState>((set, get) => ({
  roles: [],
  permissions: {},
  
  /**
   * Check if user has the specified role(s)
   */
  hasRole: (check: UserRole | UserRole[]) => {
    const { roles } = get();
    return rbacHasRole(roles, check);
  },
  
  /**
   * Check if user has the specified permission
   */
  can: (action: string) => {
    const { permissions } = get();
    return permissions[action] === true;
  },
  
  /**
   * Set user roles
   */
  setRoles: (roles: UserRole[]) => {
    set({ roles });
  },
  
  /**
   * Set user permissions
   */
  setPermissions: (permissions: Record<string, boolean>) => {
    set({ permissions });
  },
  
  /**
   * Clear RBAC state
   */
  clear: () => {
    set({ roles: [], permissions: {} });
  }
}));

/**
 * RBAC bridge for direct access without hooks
 */
export const RBACBridge = {
  /**
   * Get current user roles
   */
  getRoles: () => useRbacStore.getState().roles,
  
  /**
   * Check if user has the specified role(s)
   */
  hasRole: (check: UserRole | UserRole[]) => useRbacStore.getState().hasRole(check),
  
  /**
   * Check if user has the specified permission
   */
  can: (action: string) => useRbacStore.getState().can(action),
  
  /**
   * Check if user is admin
   */
  isAdmin: () => useRbacStore.getState().hasRole([ROLES.ADMIN, ROLES.SUPERADMIN]),
  
  /**
   * Check if user is super admin
   */
  isSuperAdmin: () => useRbacStore.getState().hasRole(ROLES.SUPERADMIN),
  
  /**
   * Check if user is moderator
   */
  isModerator: () => useRbacStore.getState().hasRole([ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPERADMIN]),
  
  /**
   * Check if user is builder
   */
  isBuilder: () => useRbacStore.getState().hasRole([ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPERADMIN])
}; 