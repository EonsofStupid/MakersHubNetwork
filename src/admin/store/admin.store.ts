import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminPermission } from '../types/admin.types';
import { defaultTopNavShortcuts, defaultDashboardShortcuts } from '@/admin/config/navigation.config';
import { PanInfo } from 'framer-motion';

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
  dragSource: string | null;
  dragTarget: string | null;
  isDragging: boolean;
  dragPreview: {
    label: string;
    icon?: React.ReactNode;
  } | null;
  dragInfo: PanInfo | null;

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
  setDragSource: (source: string | null) => void;
  setDragTarget: (target: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setDragPreview: (preview: { label: string; icon?: React.ReactNode } | null) => void;
  setDragInfo: (info: PanInfo | null) => void;
  resetDrag: () => void;
  toggleDarkMode: () => void;
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

      // Theme
      adminTheme: 'cyberpunk',

      // Drag & Drop
      dragSource: null,
      dragTarget: null,
      isDragging: false,
      dragPreview: null,
      dragInfo: null,

      // Frozen Zones
      frozenZones: [],

      // Permissions
      isLoadingPermissions: false,
      permissions: [],
      permissionsLoaded: false,

      // Actions
      setState: (state) => set(state),
      setDragSource: (source) => set({ dragSource: source }),
      setDragTarget: (target) => set({ dragTarget: target }),
      setIsDragging: (isDragging) => 
        set((state) => 
          isDragging 
            ? { isDragging: true }
            : {
                isDragging: false,
                dragSource: null,
                dragTarget: null,
                dragPreview: null,
                dragInfo: null,
              }
        ),
      setDragPreview: (preview) => set({ dragPreview: preview }),
      setDragInfo: (info) => set({ dragInfo: info }),
      resetDrag: () => 
        set({
          dragSource: null,
          dragTarget: null,
          isDragging: false,
          dragPreview: null,
          dragInfo: null,
        }),

      toggleSidebar: () =>
        set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

      setActiveSection: (section) => set({ activeSection: section }),

      setPinnedDashboardItems: (items) =>
        set({ pinnedDashboardItems: items }),

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

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
