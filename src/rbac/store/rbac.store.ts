
import { create } from 'zustand';
import { UserRole } from '@/shared/types/shared.types';
import { Permission } from '@/shared/types/shared.types';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

// Define default permissions
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

// Define the RBAC state interface
export interface RBACState {
  // State
  roles: UserRole[];
  permissions: Record<Permission, boolean>;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  setRoles: (roles: UserRole[]) => void;
  addRole: (role: UserRole) => void;
  removeRole: (role: UserRole) => void;
  setPermission: (permission: Permission, value: boolean) => void;
  setPermissions: (permissions: Record<Permission, boolean>) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  clear: () => void;
  initialize: () => void;
}

// Role-permission mappings
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  'super_admin': [
    'create_project', 'edit_project', 'delete_project',
    'submit_build', 'access_admin', 'manage_api_keys', 
    'manage_users', 'manage_roles', 'manage_permissions',
    'view_analytics', 'admin:view', 'admin:edit', 'admin:delete',
    'user:view', 'user:edit', 'user:delete', 
    'content:view', 'content:edit', 'content:delete',
    'settings:view', 'settings:edit'
  ],
  'admin': [
    'create_project', 'edit_project', 'delete_project',
    'submit_build', 'access_admin', 
    'view_analytics', 'admin:view', 'admin:edit',
    'user:view', 'user:edit',
    'content:view', 'content:edit', 'content:delete',
    'settings:view', 'settings:edit'
  ],
  'moderator': [
    'user:view', 'content:view', 'content:edit',
    'access_admin'
  ],
  'builder': [
    'create_project', 'edit_project', 'submit_build',
    'content:view', 'content:edit'
  ],
  'user': [
    'content:view'
  ],
  'guest': []
};

// Map roles to their corresponding permissions
const mapRolesToPermissions = (roles: UserRole[]): Record<Permission, boolean> => {
  // Start with all permissions false
  const permissions = { ...DEFAULT_PERMISSIONS };
  
  // Super admin has all permissions
  if (roles.includes('super_admin')) {
    Object.keys(permissions).forEach(key => {
      permissions[key as Permission] = true;
    });
    return permissions;
  }
  
  // Add permissions for each role
  roles.forEach(role => {
    const rolePerms = ROLE_PERMISSIONS[role] || [];
    rolePerms.forEach(perm => {
      permissions[perm] = true;
    });
  });
  
  return permissions;
};

// Create the RBAC store
export const rbacStore = create<RBACState>((set, get) => ({
  // Initial state
  roles: [],
  permissions: DEFAULT_PERMISSIONS,
  isLoading: false,
  error: null,
  isInitialized: false,
  
  // Initialize RBAC state
  initialize: () => {
    set({ isInitialized: true });
    
    // Try to load roles from localStorage
    try {
      const storedRoles = localStorage.getItem('user_roles');
      if (storedRoles) {
        const roles = JSON.parse(storedRoles) as UserRole[];
        const permissions = mapRolesToPermissions(roles);
        set({ roles, permissions });
        
        logger.log(LogLevel.INFO, LogCategory.RBAC, 'RBAC initialized from storage', { 
          details: { roles, permissionsCount: Object.values(permissions).filter(Boolean).length } 
        });
      }
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.RBAC, 'Error initializing RBAC from storage', {
        details: { error }
      });
    }
  },
  
  // Set user roles and derive permissions
  setRoles: (roles) => {
    const permissions = mapRolesToPermissions(roles);
    
    // Store roles in localStorage for persistence
    try {
      localStorage.setItem('user_roles', JSON.stringify(roles));
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.RBAC, 'Error storing roles in localStorage', {
        details: { error }
      });
    }
    
    set({ roles, permissions, isLoading: false, error: null });
    
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'Roles updated', { 
      details: { roles, permissionsCount: Object.values(permissions).filter(Boolean).length } 
    });
  },
  
  // Add a single role
  addRole: (role) => {
    const { roles } = get();
    if (roles.includes(role)) return;
    
    const newRoles = [...roles, role];
    get().setRoles(newRoles);
    
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'Role added', { 
      details: { role, allRoles: newRoles } 
    });
  },
  
  // Remove a single role
  removeRole: (role) => {
    const { roles } = get();
    const newRoles = roles.filter(r => r !== role);
    get().setRoles(newRoles);
    
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'Role removed', { 
      details: { role, remainingRoles: newRoles } 
    });
  },
  
  // Set a specific permission
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
  
  // Set multiple permissions at once
  setPermissions: (permissions) => {
    set({ permissions });
    
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'Permissions updated', { 
      details: { permissionsCount: Object.values(permissions).filter(Boolean).length } 
    });
  },
  
  // Set error state
  setError: (error) => {
    set({ error });
    
    if (error) {
      logger.log(LogLevel.ERROR, LogCategory.RBAC, 'RBAC error', { 
        details: { error } 
      });
    }
  },
  
  // Set loading state
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  
  // Clear RBAC state (for logout)
  clear: () => {
    // Remove roles from localStorage
    try {
      localStorage.removeItem('user_roles');
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.RBAC, 'Error clearing roles from localStorage', {
        details: { error }
      });
    }
    
    set({ roles: [], permissions: { ...DEFAULT_PERMISSIONS } });
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'RBAC state cleared');
  }
}));

// Export selectors
export const useRbacStore = rbacStore;
export const selectRoles = (state: RBACState) => state.roles;
export const selectPermissions = (state: RBACState) => state.permissions;
export const selectIsLoading = (state: RBACState) => state.isLoading;
export const selectError = (state: RBACState) => state.error;
