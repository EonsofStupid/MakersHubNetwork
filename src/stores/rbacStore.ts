import { create } from 'zustand';
import { UserRole, Permission, ROLES, LogCategory } from '@/shared/types';
import { useLogger } from '@/hooks/use-logger';

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
  const logger = useLogger('RbacStore', LogCategory.RBAC);
  
  return {
    roles: [],
    permissions: {
      'create_project': false,
      'edit_project': false,
      'delete_project': false,
      'submit_build': false,
      'access_admin': false,
      'manage_api_keys': false,
      'manage_users': false,
      'manage_roles': false,
      'manage_permissions': false,
      'view_analytics': false,
      'admin:view': false,
      'admin:edit': false,
      'admin:delete': false,
      'user:view': false,
      'user:edit': false,
      'user:delete': false,
      'content:view': false,
      'content:edit': false,
      'content:delete': false,
      'settings:view': false,
      'settings:edit': false
    },
    
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
      const defaultPermissions: Record<Permission, boolean> = {
        'create_project': false,
        'edit_project': false,
        'delete_project': false,
        'submit_build': false,
        'access_admin': false,
        'manage_api_keys': false,
        'manage_users': false,
        'manage_roles': false,
        'manage_permissions': false,
        'view_analytics': false,
        'admin:view': false,
        'admin:edit': false,
        'admin:delete': false,
        'user:view': false,
        'user:edit': false,
        'user:delete': false,
        'content:view': false,
        'content:edit': false,
        'content:delete': false,
        'settings:view': false,
        'settings:edit': false
      };
      
      set({ roles: [], permissions: defaultPermissions });
      logger.info('RBAC state cleared');
    }
  };
}); 