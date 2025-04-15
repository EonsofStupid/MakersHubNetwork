import { create } from 'zustand';
import { UserRole, Permission, ROLES, LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

// RBAC State interface
interface RBACState {
  roles: UserRole[];
  permissions: Record<Permission, boolean>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setRoles: (roles: UserRole[]) => void;
  addRole: (role: UserRole) => void;
  removeRole: (role: UserRole) => void;
  setPermissions: (permissions: Record<Permission, boolean>) => void;
  setPermission: (permission: Permission, value: boolean) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

// Helper function to map roles to permissions
const mapRolesToPermissions = (roles: UserRole[]): Record<Permission, boolean> => {
  // Create a copy of default permissions
  const permissions = { ...DEFAULT_PERMISSIONS };
  
  // Define role-based permissions
  if (roles.includes(ROLES.SUPER_ADMIN)) {
    // Super admin has all permissions
    Object.keys(permissions).forEach(key => {
      permissions[key as Permission] = true;
    });
  } else if (roles.includes(ROLES.ADMIN)) {
    // Admin permissions
    permissions['access_admin'] = true;
    permissions['admin:view'] = true;
    permissions['admin:edit'] = true;
    permissions['user:view'] = true;
    permissions['user:edit'] = true;
    permissions['content:view'] = true;
    permissions['content:edit'] = true;
    permissions['content:delete'] = true;
    permissions['manage_users'] = true;
    permissions['view_analytics'] = true;
  } else if (roles.includes(ROLES.MODERATOR)) {
    // Moderator permissions
    permissions['content:view'] = true;
    permissions['content:edit'] = true;
    permissions['user:view'] = true;
  } else if (roles.includes(ROLES.BUILDER)) {
    // Builder permissions
    permissions['create_project'] = true;
    permissions['edit_project'] = true;
    permissions['submit_build'] = true;
  } else if (roles.includes(ROLES.USER)) {
    // Basic user permissions
    permissions['create_project'] = true;
  }
  
  return permissions;
};

// Create the store with initial state and actions
export const rbacStore = create<RBACState>((set, get) => ({
  roles: [],
  permissions: { ...DEFAULT_PERMISSIONS },
  isLoading: false,
  error: null,
  
  setRoles: (roles) => {
    const permissions = mapRolesToPermissions(roles);
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'Roles updated', { 
      details: { roles, permissionsCount: Object.values(permissions).filter(Boolean).length } 
    });
    set({ roles, permissions });
  },
  
  addRole: (role) => {
    const currentRoles = get().roles;
    if (!currentRoles.includes(role)) {
      const newRoles = [...currentRoles, role];
      const permissions = mapRolesToPermissions(newRoles);
      set({ roles: newRoles, permissions });
      
      logger.log(LogLevel.INFO, LogCategory.RBAC, 'Role added', { 
        details: { role, allRoles: newRoles } 
      });
    }
  },
  
  removeRole: (role) => {
    const currentRoles = get().roles;
    const newRoles = currentRoles.filter(r => r !== role);
    const permissions = mapRolesToPermissions(newRoles);
    set({ roles: newRoles, permissions });
    
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'Role removed', { 
      details: { role, remainingRoles: newRoles } 
    });
  },
  
  setPermissions: (permissions) => {
    set({ permissions });
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'Permissions updated', { 
      details: { permissionsCount: Object.values(permissions).filter(Boolean).length } 
    });
  },
  
  setPermission: (permission, value) => {
    set(state => ({
      permissions: {
        ...state.permissions,
        [permission]: value
      }
    }));
    
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'Permission changed', { 
      details: { permission, value } 
    });
  },
  
  setError: (error) => {
    set({ error });
    if (error) {
      logger.log(LogLevel.ERROR, LogCategory.RBAC, 'Error occurred', { 
        details: { error } 
      });
    }
  },
  
  setLoading: (isLoading) => {
    set({ isLoading });
  }
}));
