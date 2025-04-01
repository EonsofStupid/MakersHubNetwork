
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAdminPersistMiddleware } from '@/admin/middleware/persist.middleware';

interface AdminState {
  // UI state
  sidebarExpanded: boolean;
  dashboardCollapsed: boolean;
  isDarkMode: boolean;
  
  // Dashboard items
  dashboardItems: string[];
  
  // Preferences
  defaultView: 'cards' | 'list' | 'table';
  
  // Methods
  setSidebarExpanded: (expanded: boolean) => void;
  setDashboardCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setDefaultView: (view: 'cards' | 'list' | 'table') => void;
  setDashboardItems: (items: string[]) => void;
}

// Use the persist middleware
export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarExpanded: true,
      dashboardCollapsed: false,
      isDarkMode: false,
      defaultView: 'cards',
      dashboardItems: ['users', 'builds', 'content', 'settings'],

      // Methods
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
      setDashboardCollapsed: (collapsed) => set({ dashboardCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDefaultView: (view) => set({ defaultView: view }),
      setDashboardItems: (items) => set({ dashboardItems: items }),
    }),
    createAdminPersistMiddleware('admin-store')
  )
);
