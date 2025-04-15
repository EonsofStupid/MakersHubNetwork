
import { create } from 'zustand';
import { UserRole, LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * RBAC state interface
 */
interface RbacState {
  roles: UserRole[];
  permissions: string[];
  
  // Role methods
  hasRole: (check: UserRole | UserRole[]) => boolean;
  setRoles: (roles: UserRole[]) => void;
  
  // Permission methods
  hasPermission: (check: string | string[]) => boolean;
  setPermissions: (permissions: string[]) => void;
  
  // Utility methods
  clear: () => void;
}

/**
 * RBAC store implementation
 * Manages roles and permissions separately from auth
 */
export const useRbacStore = create<RbacState>((set, get) => {
  return {
    roles: [],
    permissions: [],
    
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
      logger.log(LogLevel.INFO, LogCategory.RBAC, 'Roles updated', { roles });
    },

    /**
     * Check if user has the specified permission(s)
     */
    hasPermission: (check: string | string[]) => {
      const { permissions } = get();
      const checkPermissions = Array.isArray(check) ? check : [check];
      return checkPermissions.some(permission => permissions.includes(permission));
    },
    
    /**
     * Set user permissions
     */
    setPermissions: (permissions: string[]) => {
      set({ permissions });
      logger.log(LogLevel.INFO, LogCategory.RBAC, 'Permissions updated', { permissions });
    },
    
    /**
     * Clear RBAC state
     */
    clear: () => {
      set({ roles: [], permissions: [] });
      logger.log(LogLevel.INFO, LogCategory.RBAC, 'RBAC state cleared');
    }
  };
});
