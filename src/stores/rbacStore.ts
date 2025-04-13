import { create } from 'zustand';
import { UserRole, Permission, ROLES } from '@/types/shared';
import { useLogger } from '@/hooks/use-logger';
import { LOG_CATEGORY } from '@/types/shared';

/**
 * RBAC store state interface
 */
interface RBACState {
  roles: UserRole[];
  permissions: Record<Permission, boolean>;
  
  // Role methods
  hasRole: (check: UserRole | UserRole[]) => boolean;
  setRoles: (roles: UserRole[]) => void;
  
  // Permission methods
  can: (permission: Permission) => boolean;
  setPermissions: (permissions: Record<Permission, boolean>) => void;
  
  // Utility methods
  clear: () => void;
}

/**
 * RBAC store implementation
 * Manages roles and permissions separately from auth
 */
export const useRbacStore = create<RBACState>((set, get) => {
  const logger = useLogger('RbacStore', LOG_CATEGORY.RBAC);
  
  return {
    roles: [],
    permissions: {} as Record<Permission, boolean>,
    
    /**
     * Check if user has the specified role(s)
     */
    hasRole: (check: UserRole | UserRole[]) => {
      const { roles } = get();
      const checkRoles = Array.isArray(check) ? check : [check];
      return checkRoles.some(role => roles.includes(role));
    },
    
    /**
     * Set user roles
     */
    setRoles: (roles: UserRole[]) => {
      set({ roles });
      logger.info('Roles updated', { details: { roles } });
    },
    
    /**
     * Check if user has the specified permission
     */
    can: (permission: Permission) => {
      const { permissions } = get();
      return permissions[permission] === true;
    },
    
    /**
     * Set user permissions
     */
    setPermissions: (permissions: Record<Permission, boolean>) => {
      set({ permissions });
      logger.info('Permissions updated', { details: { permissions } });
    },
    
    /**
     * Clear RBAC state
     */
    clear: () => {
      set({ roles: [], permissions: {} });
      logger.info('RBAC state cleared');
    }
  };
}); 