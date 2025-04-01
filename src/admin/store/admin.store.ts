
import { create } from 'zustand';
import { AdminPermissionValue } from '@/admin/types/permissions';
import { persist } from '@/admin/middleware/persist.middleware';

interface AdminState {
  // Authentication and permissions
  isAuthenticated: boolean;
  permissions: AdminPermissionValue[];
  
  // UI state
  sidebarExpanded: boolean;
  dashboardCollapsed: boolean;
  isDarkMode: boolean;
  
  // Dashboard items (quick access shortcuts)
  dashboardItems: string[];
  
  // Preferences
  defaultView: 'cards' | 'list' | 'table';
  
  // Methods
  setPermissions: (permissions: AdminPermissionValue[]) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setDashboardCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  toggleEditMode: () => void;
  toggleDarkMode: () => void;
  setDefaultView: (view: 'cards' | 'list' | 'table') => void;
  setDashboardItems: (items: string[]) => void;
  savePreferences: () => Promise<void>;
  loadPermissions: () => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      permissions: [],
      sidebarExpanded: true,
      dashboardCollapsed: false,
      isDarkMode: false,
      defaultView: 'cards',
      dashboardItems: ['users', 'builds', 'content', 'settings'],

      // Methods
      setPermissions: (permissions) => set({ permissions }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
      setDashboardCollapsed: (collapsed) => set({ dashboardCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      toggleEditMode: () => {
        // External edit mode toggle handled via Jotai
        // This is just for compatibility with older code
        console.log("toggleEditMode called - use adminEditModeAtom instead");
      },
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDefaultView: (view) => set({ defaultView: view }),
      setDashboardItems: (items) => set({ dashboardItems: items }),
      savePreferences: async () => {
        console.log("Saving admin preferences");
        // Mock async operation
        return Promise.resolve();
      },
      loadPermissions: async () => {
        console.log("Loading admin permissions");
        // In a real app, this would fetch permissions from the backend
        return Promise.resolve();
      }
    }),
    {
      name: 'admin-store'
    }
  )
);

