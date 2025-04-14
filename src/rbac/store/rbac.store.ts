
import { create } from 'zustand';
import { UserRole, ROLES } from '../constants/roles';
import { Permission, DEFAULT_PERMISSIONS } from '../constants/permissions';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

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

/**
 * Helper function to map roles to their corresponding permissions
 */
const mapRolesToPermissions = (roles: UserRole[]): Record<Permission, boolean> => {
  // Start with default permissions (all false)
  const permissions = { ...DEFAULT_PERMISSIONS };
  
  // Super admin has all permissions
  if (roles.includes(ROLES.SUPER_ADMIN)) {
    Object.keys(permissions).forEach(key => {
      permissions[key as Permission] = true;
    });
    return permissions;
  }
  
  // Admin permissions
  if (roles.includes(ROLES.ADMIN)) {
    permissions[Permission.ADMIN_ACCESS] = true;
    permissions[Permission.ADMIN_VIEW] = true;
    permissions[Permission.USER_VIEW] = true;
    permissions[Permission.USER_EDIT] = true;
    permissions[Permission.CONTENT_VIEW] = true;
    permissions[Permission.CONTENT_CREATE] = true;
    permissions[Permission.CONTENT_EDIT] = true;
    permissions[Permission.CONTENT_DELETE] = true;
    permissions[Permission.VIEW_ANALYTICS] = true;
    permissions[Permission.PROJECT_CREATE] = true;
    permissions[Permission.PROJECT_EDIT] = true;
    permissions[Permission.PROJECT_DELETE] = true;
  }
  
  // Moderator permissions
  if (roles.includes(ROLES.MODERATOR)) {
    permissions[Permission.CONTENT_VIEW] = true;
    permissions[Permission.CONTENT_EDIT] = true;
    permissions[Permission.USER_VIEW] = true;
  }
  
  // Builder permissions
  if (roles.includes(ROLES.BUILDER)) {
    permissions[Permission.PROJECT_CREATE] = true;
    permissions[Permission.PROJECT_EDIT] = true;
    permissions[Permission.PROJECT_SUBMIT] = true;
  }
  
  // Regular user permissions
  if (roles.includes(ROLES.USER)) {
    permissions[Permission.CONTENT_VIEW] = true;
  }
  
  return permissions;
};

// Create the RBAC store
export const rbacStore = create<RBACState>((set, get) => ({
  // Initial state
  roles: [],
  permissions: { ...DEFAULT_PERMISSIONS },
  isLoading: false,
  error: null,
  isInitialized: false,
  
  // Initialize RBAC state
  initialize: () => {
    set({ isInitialized: true });
    
    // Try to load roles from localStorage (for persistence between page reloads)
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

// Export a selector hook
export const useRbacStore = rbacStore;

// Export selectors for common queries
export const selectRoles = (state: RBACState) => state.roles;
export const selectPermissions = (state: RBACState) => state.permissions;
export const selectIsLoading = (state: RBACState) => state.isLoading;
export const selectError = (state: RBACState) => state.error;
