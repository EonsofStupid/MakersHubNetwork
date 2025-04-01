
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAdminPersistMiddleware } from '@/admin/middleware/persist.middleware';
import { AdminPermissionValue } from '@/admin/types/permissions';

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
  
  // Methods
  setSidebarExpanded: (expanded: boolean) => void;
  setDashboardCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setDefaultView: (view: 'cards' | 'list' | 'table') => void;
  setDashboardItems: (items: string[]) => void;
  setPermissions: (permissions: AdminPermissionValue[]) => void;
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

      // Methods
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
      setDashboardCollapsed: (collapsed) => set({ dashboardCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDefaultView: (view) => set({ defaultView: view }),
      setDashboardItems: (items) => set({ dashboardItems: items }),
      setPermissions: (permissions) => set({ permissions }),
      savePreferences: async () => {
        // Simulate saving to backend
        await new Promise(resolve => setTimeout(resolve, 100));
        return Promise.resolve();
      }
    }),
    createAdminPersistMiddleware('admin-store')
  )
);
