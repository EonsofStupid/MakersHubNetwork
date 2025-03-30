
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminPermission } from '../types/admin.types';
import { defaultTopNavShortcuts, defaultDashboardShortcuts } from '@/admin/config/navigation.config';

export interface AdminState {
  // UI State
  sidebarExpanded: boolean;
  pinnedTopNavItems: string[];
  pinnedDashboardItems: string[];
  scrollY: number;
  activeSection: string;
  isDarkMode: boolean;
  isDashboardCollapsed: boolean;

  // Theme
  adminTheme: string;

  // Drag & Drop
  hoveredIcon: string | null;
  dragSource: string | null;
  dragTarget: string | null;
  showDragOverlay: boolean;
  isEditMode: boolean;

  // Frozen Zones
  frozenZones: string[];

  // Permissions
  isLoadingPermissions: boolean;
  permissions: AdminPermission[];
  permissionsLoaded: boolean;

  // Actions
  setState: (state: Partial<AdminState>) => void;
  loadPermissions: (mappedPermissions?: AdminPermission[]) => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
  toggleSidebar: () => void;
  setActiveSection: (section: string) => void;
  setPinnedDashboardItems: (items: string[]) => void;
  setPinnedTopNavItems: (items: string[]) => void;
  setDragSource: (source: string | null) => void;
  setDragTarget: (target: string | null) => void;
  toggleDarkMode: () => void;
  toggleEditMode: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // UI Defaults
      sidebarExpanded: true,
      pinnedTopNavItems: defaultTopNavShortcuts,
      pinnedDashboardItems: defaultDashboardShortcuts,
      scrollY: 0,
      activeSection: 'overview',
      isDarkMode: true,
      isDashboardCollapsed: false,
      isEditMode: false,

      // Theme
      adminTheme: 'cyberpunk',

      // Drag and drop
      hoveredIcon: null,
      dragSource: null,
      dragTarget: null,
      showDragOverlay: false,

      // Zones
      frozenZones: [],

      // Permissions
      isLoadingPermissions: true,
      permissions: [],
      permissionsLoaded: false,

      // Actions
      setState: (partial) => set(partial),

      toggleSidebar: () =>
        set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

      setActiveSection: (section) => set({ activeSection: section }),

      setPinnedDashboardItems: (items) =>
        set({ pinnedDashboardItems: items }),
        
      setPinnedTopNavItems: (items) =>
        set({ pinnedTopNavItems: items }),

      setDragSource: (source) => set({ dragSource: source }),

      setDragTarget: (target) => set({ dragTarget: target }),

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
        
      toggleEditMode: () =>
        set((state) => ({ isEditMode: !state.isEditMode })),

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

          const allPermissions: AdminPermission[] = [
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
            'super_admin:all',
          ];

          set({
            permissions: allPermissions,
            isLoadingPermissions: false,
            permissionsLoaded: true,
          });
        } catch (error) {
          console.error('Failed to load admin permissions:', error);
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
      partialize: (state) => {
        const {
          permissions,
          isLoadingPermissions,
          permissionsLoaded,
          loadPermissions,
          hasPermission,
          setState,
          ...rest
        } = state;
        return rest;
      },
    }
  )
);

/**
 * Typed subscribe helper for Zustand stores
 */
export function subscribeWithSelector<T>(
  store: any,
  selector: (state: AdminState) => T,
  callback: (next: T, prev: T) => void
): () => void {
  let current = selector(store.getState());
  
  return store.subscribe((state: AdminState) => {
    const next = selector(state);
    if (next !== current) {
      const prev = current;
      current = next;
      callback(next, prev);
    }
  });
}
