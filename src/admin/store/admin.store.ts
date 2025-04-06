import { create } from 'zustand';
import { AdminPermissionValue } from '../types/permissions';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

interface AdminState {
  permissions: AdminPermissionValue[];
  isLoadingPermissions: boolean;
}

interface AdminActions {
  setPermissions: (permissions: AdminPermissionValue[]) => void;
  loadPermissions: () => Promise<void>;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>((set, get) => ({
  // Initial state
  permissions: [],
  isLoadingPermissions: false,
  
  // Actions
  setPermissions: (permissions) => {
    set({ permissions });
  },
  
  loadPermissions: async () => {
    const logger = getLogger();
    try {
      set({ isLoadingPermissions: true });
      
      logger.info('Loading admin permissions', {
        category: LogCategory.ADMIN,
        source: 'admin/store'
      });
      
      // In a real implementation, this might fetch from an API
      // Here we're just keeping the permissions that were already set
      const currentPermissions = get().permissions;
      
      // If no permissions are set yet, don't overwrite with an empty array
      if (currentPermissions.length === 0) {
        logger.warn('No permissions loaded - using defaults', {
          category: LogCategory.ADMIN,
          source: 'admin/store'
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading permissions';
      
      logger.error('Error loading admin permissions', {
        category: LogCategory.ADMIN,
        source: 'admin/store',
        details: { error: errorMessage }
      });
      
      throw error;
    } finally {
      set({ isLoadingPermissions: false });
    }
  },
}));
