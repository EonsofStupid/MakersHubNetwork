
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminPermission } from '../types/admin.types';
import { defaultTopNavShortcuts, defaultDashboardShortcuts } from '@/admin/config/navigation.config';

// Combined admin state interface
interface AdminState {
  // UI State
  sidebarExpanded: boolean;
  pinnedTopNavItems: string[];
  pinnedDashboardItems: string[];
  scrollY: number;
  activeSection: string;
  isDarkMode: boolean;
  isDashboardCollapsed: boolean;
  
  // Admin Theme
  adminTheme: string;
  
  // Drag and drop state
  hoveredIcon: string | null;
  dragSource: string | null;
  dragTarget: string | null;
  showDragOverlay: boolean;
  
  // Frozen zones
  frozenZones: string[];
  
  // Auth/Permissions State
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
  toggleDarkMode: () => void;
}

// Type for the store including subscribe method
interface AdminStore extends AdminState {
  subscribe: (callback: (state: AdminState, prevState: AdminState) => void) => () => void;
}

// Create the admin store with localStorage persistence
export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Default UI state
      sidebarExpanded: true,
      pinnedTopNavItems: defaultTopNavShortcuts,
      pinnedDashboardItems: defaultDashboardShortcuts,
      scrollY: 0,
      activeSection: 'overview',
      isDarkMode: true,
      isDashboardCollapsed: false,
      
      // Default theme state
      adminTheme: 'cyberpunk',
      
      // Default drag and drop state
      hoveredIcon: null,
      dragSource: null,
      dragTarget: null,
      showDragOverlay: false,
      
      // Default frozen zones
      frozenZones: [],
      
      // Default auth state
      isLoadingPermissions: true,
      permissions: [],
      permissionsLoaded: false,
      
      // Actions
      setState: (partialState) => set(partialState),
      
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      
      setActiveSection: (section) => set({ activeSection: section }),
      
      setPinnedDashboardItems: (items) => set({ pinnedDashboardItems: items }),
      
      setDragSource: (source) => set({ dragSource: source }),
      
      setDragTarget: (target) => set({ dragTarget: target }),
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // Permission functions
      loadPermissions: async (mappedPermissions) => {
        // Skip loading if permissions are already loaded
        if (get().permissionsLoaded) {
          set({ isLoadingPermissions: false });
          return;
        }
        
        set({ isLoadingPermissions: true });
        
        try {
          // If we already have mapped permissions from the role, use those
          if (mappedPermissions && mappedPermissions.length > 0) {
            set({ 
              permissions: mappedPermissions,
              isLoadingPermissions: false,
              permissionsLoaded: true
            });
            return;
          }

          // Simulate API call to load permissions
          // In a real app, this would be an API call to fetch user permissions
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // For demo purposes, we'll grant all permissions if no specific permissions are provided
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
            'super_admin:all'
          ];
          
          set({ 
            permissions: allPermissions,
            isLoadingPermissions: false,
            permissionsLoaded: true
          });
        } catch (error) {
          console.error('Failed to load admin permissions:', error);
          set({ 
            permissions: ['admin:access'], // Grant minimal permissions on error
            isLoadingPermissions: false,
            permissionsLoaded: true
          });
        }
      },
      
      hasPermission: (permission) => {
        const { permissions } = get();
        
        // Super admin has all permissions
        if (permissions.includes('super_admin:all')) {
          return true;
        }
        
        return permissions.includes(permission);
      }
    }),
    {
      name: 'admin-store',
      partialize: (state) => {
        // Only persist UI preferences to localStorage, exclude function properties and loading states
        const { permissions, isLoadingPermissions, permissionsLoaded, loadPermissions, hasPermission, setState, ...persistedState } = state;
        return persistedState;
      },
    }
  )
);

// Add subscribe method to the store
const storeApi = useAdminStore as unknown as AdminStore;

// Implement the subscribe method properly
const originalSubscribe = storeApi.subscribe;
storeApi.subscribe = (callback: (state: AdminState, prevState: AdminState) => void) => {
  let previousState = storeApi.getState();
  
  return useAdminStore.subscribe((state) => {
    const nextState = state;
    callback(nextState, previousState);
    previousState = { ...nextState };
  });
};
