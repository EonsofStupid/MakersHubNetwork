
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PermissionValue, PERMISSIONS } from '@/auth/permissions';
import { publishAuthEvent } from '@/auth/bridge';
import { mapRolesToPermissions } from '@/auth/rbac/roles';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

interface AdminState {
  permissions: PermissionValue[];
  isLoadingPermissions: boolean;
  isInitialized: boolean;
  sidebarExpanded: boolean;
}

interface AdminActions {
  setPermissions: (permissions: PermissionValue[]) => void;
  loadPermissions: () => Promise<void>;
  toggleSidebar: () => void;
  savePreferences: () => Promise<void>;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // State
      permissions: [],
      isLoadingPermissions: false,
      isInitialized: false,
      sidebarExpanded: true,
      
      // Actions
      setPermissions: (permissions) => {
        set({ permissions, isInitialized: true });
        
        // Notify through bridge
        publishAuthEvent({
          type: 'AUTH_PERMISSION_CHANGED',
          payload: { permissions }
        });
      },
      
      loadPermissions: async () => {
        const logger = getLogger();
        
        try {
          set({ isLoadingPermissions: true });
          
          // In real app, this would load from API
          // For now, just simulate using the auth store
          const authStore = (await import('@/auth/store/auth.store')).useAuthStore;
          const roles = authStore.getState().roles;
          
          // Map roles to permissions
          const permissions = mapRolesToPermissions(roles);
          
          // Update state
          set({ 
            permissions,
            isLoadingPermissions: false,
            isInitialized: true
          });
          
          logger.info('Admin permissions loaded', {
            category: LogCategory.ADMIN,
            source: 'admin.store',
            details: { permissionsCount: permissions.length }
          });
          
        } catch (error) {
          logger.error('Failed to load admin permissions', {
            category: LogCategory.ADMIN,
            source: 'admin.store',
            details: { error }
          });
          
          set({ isLoadingPermissions: false });
          throw error;
        }
      },
      
      toggleSidebar: () => {
        set(state => ({ sidebarExpanded: !state.sidebarExpanded }));
      },
      
      savePreferences: async () => {
        const logger = getLogger();
        const { sidebarExpanded } = get();
        
        try {
          // In real app, save to backend
          logger.info('Admin preferences saved', {
            category: LogCategory.ADMIN,
            source: 'admin.store',
            details: { sidebarExpanded }
          });
          
        } catch (error) {
          logger.error('Failed to save admin preferences', {
            category: LogCategory.ADMIN,
            source: 'admin.store',
            details: { error }
          });
          
          throw error;
        }
      }
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        sidebarExpanded: state.sidebarExpanded
      }),
    }
  )
);
