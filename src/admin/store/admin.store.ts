import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAdminPersistMiddleware } from "../middleware/persist.middleware";
import { AdminPermissionValue } from "../constants/permissions";
import { toast } from "sonner";
import { AdminDataService } from "../services/adminData.service";
import { useAuthStore } from "@/stores/auth/store";

export interface AdminState {
  isEditMode: boolean;
  hasInitialized: boolean;
  preferencesChanged: boolean;
  
  sidebarExpanded: boolean;
  activeSection: string;
  isDashboardCollapsed: boolean;
  showLabels: boolean;
  
  dragSource: string | null;
  dragTarget: string | null;
  
  pinnedTopNavItems: string[];
  adminTopNavShortcuts: string[];
  dashboardShortcuts: string[];
  
  permissions: AdminPermissionValue[];
  isLoadingPermissions: boolean;
  
  isDarkMode: boolean;
  adminTheme: string;
  
  setEditMode: (isEditMode: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  toggleEditMode: () => void;
  setActiveSection: (section: string) => void;
  setDashboardCollapsed: (collapsed: boolean) => void;
  setShowLabels: (show: boolean) => void;
  
  setDragSource: (source: string | null) => void;
  setDragTarget: (target: string | null) => void;
  
  setPinnedTopNavItems: (shortcuts: string[]) => void;
  setTopNavShortcuts: (shortcuts: string[]) => void;
  setDashboardShortcuts: (shortcuts: string[]) => void;
  
  toggleDarkMode: () => void;
  setTheme: (theme: string) => void;
  
  markPreferencesChanged: () => void;
  resetPreferencesChanged: () => void;
  initializeStore: () => void;
  savePreferences: () => Promise<boolean>;
  syncFromDatabase: () => Promise<void>;
  
  loadPermissions: (permissions?: AdminPermissionValue[]) => Promise<void>;
  hasPermission: (permission: AdminPermissionValue) => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isEditMode: false,
      hasInitialized: false,
      preferencesChanged: false,
      sidebarExpanded: true,
      activeSection: 'overview',
      isDashboardCollapsed: false,
      showLabels: true,
      dragSource: null,
      dragTarget: null,
      pinnedTopNavItems: ['users', 'builds', 'reviews', 'settings'],
      adminTopNavShortcuts: ['users', 'builds', 'reviews', 'settings'],
      dashboardShortcuts: ['content', 'data-maestro', 'themes', 'settings'],
      permissions: [],
      isLoadingPermissions: false,
      isDarkMode: false,
      adminTheme: 'cyberpunk',
      
      setEditMode: (isEditMode) => set({ isEditMode }),
      setSidebarExpanded: (expanded) => set({ 
        sidebarExpanded: expanded,
        preferencesChanged: true 
      }),
      toggleSidebar: () => set((state) => ({ 
        sidebarExpanded: !state.sidebarExpanded,
        preferencesChanged: true 
      })),
      toggleEditMode: () => {
        const currentMode = get().isEditMode;
        set({ isEditMode: !currentMode });
        
        if (!currentMode) {
          toast.success("Edit mode enabled", {
            description: "You can now drag and drop items to customize your dashboard"
          });
        } else {
          get().savePreferences();
          toast.success("Edit mode disabled", {
            description: "Your changes have been saved"
          });
        }
      },
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
      
      setDragSource: (source) => set({ dragSource: source }),
      setDragTarget: (target) => set({ dragTarget: target }),
      
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
      
      toggleDarkMode: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode,
        preferencesChanged: true 
      })),
      setTheme: (theme) => set({ 
        adminTheme: theme,
        preferencesChanged: true 
      }),
      
      markPreferencesChanged: () => set({ preferencesChanged: true }),
      resetPreferencesChanged: () => set({ preferencesChanged: false }),
      initializeStore: () => {
        set({ hasInitialized: true });
        get().syncFromDatabase();
      },
      
      savePreferences: async () => {
        if (!get().preferencesChanged) return true;
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user?.id) {
            console.error('Cannot save admin preferences: User not authenticated');
            return false;
          }
          
          const preferences = {
            sidebarExpanded: get().sidebarExpanded,
            activeSection: get().activeSection,
            isDashboardCollapsed: get().isDashboardCollapsed,
            pinnedTopNavItems: get().pinnedTopNavItems,
            dashboardShortcuts: get().dashboardShortcuts,
            adminTheme: get().adminTheme,
            showLabels: get().showLabels,
            isDarkMode: get().isDarkMode,
          };
          
          const { success, error } = await AdminDataService.savePreferences(user.id, preferences);
          
          if (!success) {
            console.error('Failed to save admin preferences:', error);
            toast.error("Failed to save preferences", {
              description: error || "Your changes couldn't be saved to the database"
            });
            return false;
          }
          
          set({ preferencesChanged: false });
          return true;
        } catch (error) {
          console.error('Failed to save admin preferences:', error);
          toast.error("Failed to save preferences", {
            description: "Your changes will be saved locally but not synced to the server"
          });
          return false;
        }
      },
      
      syncFromDatabase: async () => {
        try {
          const user = useAuthStore.getState().user;
          
          if (!user?.id) {
            console.warn('Cannot sync admin preferences: User not authenticated');
            return;
          }
          
          const { data: preferences, error } = await AdminDataService.loadPreferences(user.id);
          
          if (error) {
            console.warn('Failed to load preferences from database:', error);
            return;
          }
          
          if (preferences) {
            set({
              sidebarExpanded: preferences.sidebar_expanded ?? true,
              activeSection: preferences.active_section ?? 'overview',
              isDashboardCollapsed: preferences.dashboard_collapsed ?? false,
              pinnedTopNavItems: preferences.topnav_items ?? ['users', 'builds', 'reviews', 'settings'],
              adminTopNavShortcuts: preferences.topnav_items ?? ['users', 'builds', 'reviews', 'settings'],
              dashboardShortcuts: preferences.dashboard_items ?? ['content', 'data-maestro', 'themes', 'settings'],
              adminTheme: preferences.theme_preference ?? 'cyberpunk',
              showLabels: preferences.show_labels ?? true,
              isDarkMode: preferences.is_dark_mode ?? false,
              preferencesChanged: false,
            });
            
            console.log('Admin preferences loaded successfully from database');
          }
        } catch (error) {
          console.error('Failed to load preferences from database:', error);
        }
      },
      
      loadPermissions: async (permissions) => {
        set({ isLoadingPermissions: true });
        try {
          if (permissions && permissions.length > 0) {
            set({ permissions, isLoadingPermissions: false });
            return;
          }
          
          const roles = useAuthStore.getState().roles;
          const isAdmin = roles?.includes('admin');
          const isSuperAdmin = roles?.includes('super_admin');
          
          if (!isAdmin && !isSuperAdmin) {
            set({ permissions: [], isLoadingPermissions: false });
            return;
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          let userPermissions: AdminPermissionValue[] = [];
          
          if (isSuperAdmin) {
            userPermissions = ['super_admin:all', 'admin:access', 'admin:view', 'admin:edit'];
          } else if (isAdmin) {
            userPermissions = [
              'admin:access', 'admin:view', 'admin:edit',
              'content:view', 'content:edit',
              'users:view', 'users:edit',
              'builds:view', 'builds:approve',
              'themes:view'
            ];
          }
          
          set({ permissions: userPermissions, isLoadingPermissions: false });
        } catch (error) {
          console.error('Failed to load permissions:', error);
          set({ isLoadingPermissions: false });
        }
      },
      
      hasPermission: (permission: AdminPermissionValue) => {
        if (get().permissions.includes('super_admin:all')) {
          return true;
        }
        
        if (permission === 'admin:access' && get().permissions.length > 0) {
          return true;
        }
        
        return get().permissions.includes(permission);
      }
    }),
    createAdminPersistMiddleware<AdminState>('admin-store')
  )
);
