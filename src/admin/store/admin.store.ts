
import { create } from 'zustand';
import { persist, StateStorage, StorageValue } from 'zustand/middleware';
import { AdminPermission } from '../types/admin.types';
import { defaultTopNavShortcuts, defaultDashboardShortcuts } from '@/admin/config/navigation.config';

interface AdminState {
  sidebarExpanded: boolean;
  pinnedTopNavItems: string[];
  pinnedDashboardItems: string[];
  scrollY: number;
  activeSection: string;
  isDarkMode: boolean;
  isDashboardCollapsed: boolean;
  adminTheme: string;
  hoveredIcon: string | null;
  dragSource: string | null;
  dragTarget: string | null;
  showDragOverlay: boolean;
  frozenZones: string[];
  isLoadingPermissions: boolean;
  permissions: AdminPermission[];
  permissionsLoaded: boolean;

  setState: (state: Partial<AdminState>) => void;
  loadPermissions: (mappedPermissions?: AdminPermission[]) => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
  toggleSidebar: () => void;
  setActiveSection: (section: string) => void;
  setPinnedDashboardItems: (items: string[]) => void;
  setDragSource: (source: string | null) => void;
  setDragTarget: (target: string | null) => void;
  toggleDarkMode: () => void;
}

// Create a custom storage adapter to handle JSON serialization
const customStorage: StateStorage = {
  getItem: (name) => {
    try {
      const value = localStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      sidebarExpanded: true,
      pinnedTopNavItems: defaultTopNavShortcuts,
      pinnedDashboardItems: defaultDashboardShortcuts,
      scrollY: 0,
      activeSection: 'overview',
      isDarkMode: true,
      isDashboardCollapsed: false,
      adminTheme: 'cyberpunk',
      hoveredIcon: null,
      dragSource: null,
      dragTarget: null,
      showDragOverlay: false,
      frozenZones: [],
      isLoadingPermissions: true,
      permissions: [],
      permissionsLoaded: false,

      setState: (partialState) => set(partialState),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      setActiveSection: (section) => set({ activeSection: section }),
      setPinnedDashboardItems: (items) => set({ pinnedDashboardItems: items }),
      setDragSource: (source) => set({ dragSource: source }),
      setDragTarget: (target) => set({ dragTarget: target }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      loadPermissions: async (mappedPermissions) => {
        if (get().permissionsLoaded) {
          set({ isLoadingPermissions: false });
          return;
        }

        set({ isLoadingPermissions: true });

        try {
          if (mappedPermissions?.length) {
            set({
              permissions: mappedPermissions,
              isLoadingPermissions: false,
              permissionsLoaded: true,
            });
            return;
          }

          await new Promise((res) => setTimeout(res, 300));

          set({
            permissions: [
              'admin:access',
              'admin:view',
              'admin:edit',
              'content:view',
              'content:edit',
              'content:delete',
              'users:view',
              'users:edit',
              'users:delete',
              'builds:view',
              'builds:approve',
              'builds:reject',
              'themes:view',
              'themes:edit',
              'themes:delete',
              'data:view',
              'settings:view',
              'settings:edit',
              'data:import',
              'super_admin:all'
            ],
            isLoadingPermissions: false,
            permissionsLoaded: true,
          });
        } catch (error) {
          console.error('Failed to load permissions:', error);
          set({
            permissions: ['admin:access'],
            isLoadingPermissions: false,
            permissionsLoaded: true,
          });
        }
      },

      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes('super_admin:all') || permissions.includes(permission);
      },
    }),
    {
      name: 'admin-store',
      storage: customStorage,
      partialize: (state) => {
        const {
          permissions,
          isLoadingPermissions,
          permissionsLoaded,
          loadPermissions,
          hasPermission,
          setState,
          ...persisted
        } = state;
        return persisted;
      },
    }
  )
);
