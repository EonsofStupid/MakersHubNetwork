
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminPermissionValue } from '@/admin/types/permissions';

interface AdminState {
  isAuthenticated: boolean;
  permissions: AdminPermissionValue[];
  isEditMode: boolean;
  sidebarExpanded: boolean;
  dashboardCollapsed: boolean;
  preferences: Record<string, any>;
  initialized: boolean;
  showLabels: boolean;
  activeSection: string;
}

interface AdminActions {
  setIsAuthenticated: (value: boolean) => void;
  setPermissions: (permissions: AdminPermissionValue[]) => void;
  setEditMode: (value: boolean) => void;
  toggleSidebar: () => void;
  toggleDashboard: () => void;
  setSidebarExpanded: (value: boolean) => void;
  setDashboardCollapsed: (value: boolean) => void;
  updatePreference: <T>(key: string, value: T) => void;
  savePreferences: () => Promise<void>;
  initializeStore: () => Promise<void>;
  loadPermissions: () => void;
  setActiveSection: (section: string) => void;
  setShowLabels: (value: boolean) => void;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // State
      isAuthenticated: false,
      permissions: [],
      isEditMode: false,
      sidebarExpanded: true,
      dashboardCollapsed: false,
      preferences: {},
      initialized: false,
      showLabels: true,
      activeSection: 'overview',

      // Actions
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setPermissions: (permissions) => set({ permissions }),
      setEditMode: (value) => set({ isEditMode: value }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      toggleDashboard: () => set((state) => ({ dashboardCollapsed: !state.dashboardCollapsed })),
      setSidebarExpanded: (value) => set({ sidebarExpanded: value }),
      setDashboardCollapsed: (value) => set({ dashboardCollapsed: value }),
      updatePreference: (key, value) => 
        set((state) => ({ 
          preferences: { ...state.preferences, [key]: value } 
        })),
      savePreferences: async () => {
        const { preferences } = get();
        // TODO: Save to database if needed
        console.log('Saving preferences:', preferences);
        return Promise.resolve();
      },
      initializeStore: async () => {
        try {
          // Here we would load preferences from database if needed
          set({ initialized: true });
          return Promise.resolve();
        } catch (error) {
          console.error('Failed to initialize admin store:', error);
          return Promise.reject(error);
        }
      },
      loadPermissions: () => {
        // This would be implemented to load permissions from the auth system
        console.log('Loading permissions from auth system');
      },
      setActiveSection: (section) => set({ activeSection: section }),
      setShowLabels: (value) => set({ showLabels: value })
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        sidebarExpanded: state.sidebarExpanded,
        dashboardCollapsed: state.dashboardCollapsed,
        preferences: state.preferences,
      }),
    }
  )
);
