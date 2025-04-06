
import { create } from 'zustand';
import { UserRole } from '@/auth/types/roles';
import { PermissionValue, PERMISSIONS, ROLE_PERMISSIONS } from '@/auth/permissions';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

interface AdminStoreState {
  permissions: PermissionValue[];
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setPermissions: (permissions: PermissionValue[]) => void;
  loadPermissions: () => Promise<PermissionValue[]>;
}

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  permissions: [],
  isLoading: false,
  error: null,
  
  // Set permissions directly
  setPermissions: (permissions) => set({ permissions }),
  
  // Load permissions based on roles
  loadPermissions: async () => {
    const logger = getLogger('adminStore', LogCategory.ADMIN);
    set({ isLoading: true, error: null });
    
    try {
      // This would normally fetch permissions from API
      // For now, just simulate a network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, we'd get the roles from auth
      // and map them to permissions
      const roles = ['admin']; // Example role
      let allPermissions: PermissionValue[] = [];
      
      // Map roles to permissions
      roles.forEach(role => {
        const rolePermissions = ROLE_PERMISSIONS[role as UserRole] || [];
        allPermissions = [...allPermissions, ...rolePermissions];
      });
      
      // Deduplicate permissions
      const uniquePermissions = [...new Set(allPermissions)];
      
      set({ 
        permissions: uniquePermissions,
        isLoading: false 
      });
      
      logger.info('Admin permissions loaded', {
        details: { 
          permissionCount: uniquePermissions.length 
        }
      });
      
      return uniquePermissions;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      logger.error('Failed to load admin permissions', {
        details: { 
          error: errorObj.message 
        }
      });
      
      set({ 
        error: errorObj, 
        isLoading: false 
      });
      
      throw errorObj;
    }
  }
}));
