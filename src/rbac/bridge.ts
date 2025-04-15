
import { UserRole, ROLES } from '@/shared/types/shared.types';
import { useRbacStore } from './store';
import { IRBACBridge } from './types';

/**
 * Bridge implementation for RBAC functionality
 * Provides an interface for role-based access control
 */
export const RBACBridge: IRBACBridge = {
  hasRole: (role: UserRole | UserRole[]): boolean => {
    const { hasRole } = useRbacStore.getState();
    return hasRole(role);
  },
  
  getRoles: (): UserRole[] => {
    const { roles } = useRbacStore.getState();
    return roles;
  },

  hasAdminAccess: (): boolean => {
    return RBACBridge.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  },

  isSuperAdmin: (): boolean => {
    return RBACBridge.hasRole(ROLES.SUPER_ADMIN);
  },
  
  isModerator: (): boolean => {
    return RBACBridge.hasRole(ROLES.MODERATOR);
  },
  
  isBuilder: (): boolean => {
    return RBACBridge.hasRole(ROLES.BUILDER);
  },

  setRoles: (roles: UserRole[]): void => {
    const { setRoles } = useRbacStore.getState();
    setRoles(roles);
  },

  clearRoles: (): void => {
    const { clear } = useRbacStore.getState();
    clear();
  },

  hasPermission: (permission: string): boolean => {
    const { hasPermission } = useRbacStore.getState();
    return hasPermission(permission);
  },

  canAccessAdminSection: (section?: string): boolean => {
    return RBACBridge.hasAdminAccess();
  }
};
