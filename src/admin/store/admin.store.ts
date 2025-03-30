
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAdminPersistMiddleware } from "../middleware/persist.middleware";
import { AdminPermission } from "../types/admin.types";

export interface AdminState {
  // Session and initialization
  isEditMode: boolean;
  hasInitialized: boolean;
  preferencesChanged: boolean;
  
  // UI state
  sidebarExpanded: boolean;
  activeSection: string;
  isDashboardCollapsed: boolean;
  showLabels: boolean;
  
  // Drag and drop state
  dragSource: string | null;
  dragTarget: string | null;
  
  // Shortcuts and customization
  pinnedTopNavItems: string[];
  adminTopNavShortcuts: string[];
  dashboardShortcuts: string[];
  
  // Permissions
  permissions: AdminPermission[];
  isLoadingPermissions: boolean;
  
  // Theme settings
  isDarkMode: boolean;
  adminTheme: string;
  
  // Actions - UI
  setEditMode: (isEditMode: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  toggleEditMode: () => void;
  setActiveSection: (section: string) => void;
  setDashboardCollapsed: (collapsed: boolean) => void;
  setShowLabels: (show: boolean) => void;
  
  // Actions - Drag and drop
  setDragSource: (source: string | null) => void;
  setDragTarget: (target: string | null) => void;
  
  // Actions - Shortcuts
  setPinnedTopNavItems: (shortcuts: string[]) => void;
  setTopNavShortcuts: (shortcuts: string[]) => void;
  setDashboardShortcuts: (shortcuts: string[]) => void;
  
  // Actions - Theme
  toggleDarkMode: () => void;
  setTheme: (theme: string) => void;
  
  // Actions - Persistence
  markPreferencesChanged: () => void;
  resetPreferencesChanged: () => void;
  initializeStore: () => void;
  
  // Actions - Permissions
  loadPermissions: (permissions?: AdminPermission[]) => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial state
      isEditMode: false,
      hasInitialized: false,
      preferencesChanged: false,
      sidebarExpanded: true,
      activeSection: 'overview',
      isDashboardCollapsed: false,
      showLabels: true,
      dragSource: null,
      dragTarget: null,
      pinnedTopNavItems: ['users', 'builds', 'reviews'],
      adminTopNavShortcuts: ['users', 'builds', 'reviews'],
      dashboardShortcuts: ['content', 'data-maestro', 'themes', 'settings'],
      permissions: [],
      isLoadingPermissions: false,
      isDarkMode: false,
      adminTheme: 'cyberpunk',
      
      // UI Actions
      setEditMode: (isEditMode) => set({ isEditMode }),
      setSidebarExpanded: (expanded) => set({ 
        sidebarExpanded: expanded,
        preferencesChanged: true 
      }),
      toggleSidebar: () => set((state) => ({ 
        sidebarExpanded: !state.sidebarExpanded,
        preferencesChanged: true 
      })),
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      setActiveSection: (section) => set({ 
        activeSection: section,
        preferencesChanged: true 
      }),
      setDashboardCollapsed: (collapsed) => set({ 
        isDashboardCollapsed: collapsed,
        preferencesChanged: true 
      }),
      setShowLabels: (show) => set({ 
        showLabels: show,
        preferencesChanged: true 
      }),
      
      // Drag and drop actions
      setDragSource: (source) => set({ dragSource: source }),
      setDragTarget: (target) => set({ dragTarget: target }),
      
      // Shortcut actions
      setPinnedTopNavItems: (items) => set({ 
        pinnedTopNavItems: items,
        adminTopNavShortcuts: items,
        preferencesChanged: true 
      }),
      setTopNavShortcuts: (shortcuts) => set({ 
        adminTopNavShortcuts: shortcuts,
        pinnedTopNavItems: shortcuts,
        preferencesChanged: true 
      }),
      setDashboardShortcuts: (shortcuts) => set({ 
        dashboardShortcuts: shortcuts,
        preferencesChanged: true 
      }),
      
      // Theme actions
      toggleDarkMode: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode,
        preferencesChanged: true 
      })),
      setTheme: (theme) => set({ 
        adminTheme: theme,
        preferencesChanged: true 
      }),
      
      // Persistence actions
      markPreferencesChanged: () => set({ preferencesChanged: true }),
      resetPreferencesChanged: () => set({ preferencesChanged: false }),
      initializeStore: () => set({ hasInitialized: true }),
      
      // Permission actions
      loadPermissions: async (permissions) => {
        set({ isLoadingPermissions: true });
        try {
          // If permissions were passed in, use those
          if (permissions && permissions.length > 0) {
            set({ permissions, isLoadingPermissions: false });
            return;
          }
          
          // Otherwise simulate API call for now
          await new Promise(resolve => setTimeout(resolve, 500));
          const userPermissions: AdminPermission[] = [
            'admin:access', 'admin:view', 'admin:edit',
            'content:view', 'content:edit',
            'users:view', 'users:edit',
            'builds:view', 'builds:approve',
            'themes:view'
          ];
          set({ permissions: userPermissions, isLoadingPermissions: false });
        } catch (error) {
          console.error('Failed to load permissions:', error);
          set({ isLoadingPermissions: false });
        }
      },
      hasPermission: (permission: AdminPermission) => {
        // Super admin has all permissions
        if (get().permissions.includes('super_admin:all')) {
          return true;
        }
        
        // Basic admin access always granted if in admin permissions
        if (permission === 'admin:access' && get().permissions.length > 0) {
          return true;
        }
        
        return get().permissions.includes(permission);
      }
    }),
    createAdminPersistMiddleware<AdminState>('admin-store')
  )
);
