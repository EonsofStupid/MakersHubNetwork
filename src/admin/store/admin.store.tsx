
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminPermission } from '@/admin/types/admin.types';

interface AdminState {
  // Sidebar state
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  
  // Navigation state
  activeSection: string;
  setActiveSection: (section: string) => void;
  
  // Edit mode state
  isEditMode: boolean;
  toggleEditMode: () => void;
  
  // Dashboard state
  isDashboardCollapsed: boolean;
  setDashboardCollapsed: (collapsed: boolean) => void;
  toggleDashboardCollapsed: () => void;
  
  // Shortcuts state
  pinnedTopNavItems: string[];
  setPinnedTopNavItems: (items: string[]) => void;
  dashboardShortcuts: string[];
  setDashboardShortcuts: (items: string[]) => void;
  
  // Drag and drop state
  dragSource: string | null;
  setDragSource: (id: string | null) => void;
  dragTarget: string | null;
  setDragTarget: (id: string | null) => void;
  
  // Permissions state
  permissions: AdminPermission[];
  hasPermission: (permission: AdminPermission) => boolean;
  loadPermissions: () => void;
  
  // Theme state
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarExpanded: true,
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      
      // Navigation state
      activeSection: 'overview',
      setActiveSection: (section) => set({ activeSection: section }),
      
      // Edit mode state
      isEditMode: false,
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      
      // Dashboard state
      isDashboardCollapsed: false,
      setDashboardCollapsed: (collapsed) => set({ isDashboardCollapsed: collapsed }),
      toggleDashboardCollapsed: () => set((state) => ({ isDashboardCollapsed: !state.isDashboardCollapsed })),
      
      // Shortcuts state - Default values for new users
      pinnedTopNavItems: ['overview', 'users', 'builds'],
      setPinnedTopNavItems: (items) => set({ pinnedTopNavItems: items }),
      dashboardShortcuts: ['content', 'data', 'settings', 'analytics'],
      setDashboardShortcuts: (items) => set({ dashboardShortcuts: items }),
      
      // Drag and drop state
      dragSource: null,
      setDragSource: (id) => set({ dragSource: id }),
      dragTarget: null,
      setDragTarget: (id) => set({ dragTarget: id }),
      
      // Permissions state
      permissions: ['admin:access', 'users:view', 'builds:view', 'content:view'],
      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission) || permissions.includes('super_admin:all');
      },
      loadPermissions: () => {
        // In a real app, this would load from API
        // For now, using some default permissions
        set({
          permissions: [
            'admin:access',
            'users:view',
            'users:edit',
            'builds:view',
            'builds:edit',
            'content:view',
            'content:edit',
            'data:view',
            'settings:view',
            'themes:view'
          ]
        });
      },
      
      // Theme state
      isDarkMode: true,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        sidebarExpanded: state.sidebarExpanded,
        pinnedTopNavItems: state.pinnedTopNavItems,
        dashboardShortcuts: state.dashboardShortcuts,
        isDashboardCollapsed: state.isDashboardCollapsed,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
