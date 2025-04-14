
import { create } from 'zustand';
import { UserRole, Permission, ROLES, LogCategory } from '@/shared/types/shared.types';
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

const DEFAULT_PERMISSIONS: Record<Permission, boolean> = {
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
    logger.info('RBAC roles updated', { 
      category: LogCategory.RBAC,
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
      
      logger.info('RBAC role added', { 
        category: LogCategory.RBAC,
        details: { role, allRoles: newRoles } 
      });
    }
  },
  
  removeRole: (role) => {
    const currentRoles = get().roles;
    const newRoles = currentRoles.filter(r => r !== role);
    const permissions = mapRolesToPermissions(newRoles);
    set({ roles: newRoles, permissions });
    
    logger.info('RBAC role removed', { 
      category: LogCategory.RBAC,
      details: { role, remainingRoles: newRoles } 
    });
  },
  
  setPermissions: (permissions) => {
    set({ permissions });
    
    logger.info('RBAC permissions updated', { 
      category: LogCategory.RBAC,
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
    
    logger.info('RBAC permission changed', { 
      category: LogCategory.RBAC,
      details: { permission, value } 
    });
  },
  
  setError: (error) => {
    set({ error });
    
    if (error) {
      logger.error('RBAC error', { 
        category: LogCategory.RBAC,
        details: { error } 
      });
    }
  },
  
  setLoading: (isLoading) => {
    set({ isLoading });
  }
}));
