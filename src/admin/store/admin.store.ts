
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAdminPersistMiddleware } from '@/admin/middleware/persist.middleware';
import { AdminPermissionValue } from '@/admin/types/permissions';
import { ROLE_PERMISSIONS } from '@/admin/constants/permissions';
import { useAuthStore } from '@/auth/store/auth.store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

interface AdminState {
  // UI state
  sidebarExpanded: boolean;
  dashboardCollapsed: boolean;
  isDarkMode: boolean;
  
  // Dashboard items
  dashboardItems: string[];
  
  // Preferences
  defaultView: 'cards' | 'list' | 'table';
  
  // Permissions
  permissions: AdminPermissionValue[];
  isLoadingPermissions: boolean;
  
  // Methods
  setSidebarExpanded: (expanded: boolean) => void;
  setDashboardCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setDefaultView: (view: 'cards' | 'list' | 'table') => void;
  setDashboardItems: (items: string[]) => void;
  setPermissions: (permissions: AdminPermissionValue[]) => void;
  loadPermissions: () => Promise<void>;
  savePreferences: () => Promise<void>;
}

// Use the persist middleware
export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarExpanded: true,
      dashboardCollapsed: false,
      isDarkMode: false,
      defaultView: 'cards',
      dashboardItems: ['users', 'builds', 'content', 'settings'],
      permissions: [],
      isLoadingPermissions: false,

      // Methods
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
      setDashboardCollapsed: (collapsed) => set({ dashboardCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDefaultView: (view) => set({ defaultView: view }),
      setDashboardItems: (items) => set({ dashboardItems: items }),
      setPermissions: (permissions) => set({ permissions }),
      
      // Load permissions from auth store roles
      loadPermissions: async () => {
        const logger = getLogger();
        set({ isLoadingPermissions: true });

        try {
          // Get current user roles from auth store
          const authState = useAuthStore.getState();
          const { roles } = authState;
          
          logger.info('Loading admin permissions', {
            category: LogCategory.ADMIN,
            source: 'admin/store',
            details: { userRoles: roles }
          });
          
          // Map roles to admin permissions
          let allPermissions: AdminPermissionValue[] = [];
          
          roles.forEach(role => {
            const rolePermissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
            if (rolePermissions) {
              rolePermissions.forEach(permission => {
                if (!allPermissions.includes(permission)) {
                  allPermissions.push(permission);
                }
              });
            }
          });
          
          set({ permissions: allPermissions });
          
          logger.info('Admin permissions loaded', {
            category: LogCategory.ADMIN,
            source: 'admin/store',
            details: { 
              permissionsCount: allPermissions.length,
              permissions: allPermissions
            }
          });
          
          return Promise.resolve();
        } catch (error) {
          logger.error('Error loading admin permissions', {
            category: LogCategory.ADMIN,
            source: 'admin/store',
            details: { error }
          });
          return Promise.reject(error);
        } finally {
          set({ isLoadingPermissions: false });
        }
      },
      
      savePreferences: async () => {
        // Simulate saving to backend
        await new Promise(resolve => setTimeout(resolve, 100));
        return Promise.resolve();
      }
    }),
    createAdminPersistMiddleware('admin-store')
  )
);
