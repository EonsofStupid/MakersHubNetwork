
import { create } from 'zustand';
import { AdminPermissionValue } from '@/admin/types/permissions';

interface AdminState {
  // Authentication and permissions
  isAuthenticated: boolean;
  permissions: AdminPermissionValue[];
  
  // UI state
  sidebarExpanded: boolean;
  dashboardCollapsed: boolean;
  
  // Preferences
  darkMode: boolean;
  defaultView: 'cards' | 'list' | 'table';
  
  // Methods
  setPermissions: (permissions: AdminPermissionValue[]) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setDashboardCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setDefaultView: (view: 'cards' | 'list' | 'table') => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  isAuthenticated: false,
  permissions: [],
  sidebarExpanded: true,
  dashboardCollapsed: false,
  darkMode: false,
  defaultView: 'cards',

  // Methods
  setPermissions: (permissions) => set({ permissions }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  setDashboardCollapsed: (collapsed) => set({ dashboardCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setDefaultView: (view) => set({ defaultView: view })
}));
