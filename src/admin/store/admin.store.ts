
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminPermission } from '../types/admin.types';

// Combined admin state interface
interface AdminState {
  // UI State
  sidebarExpanded: boolean;
  pinnedIcons: string[];
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
  
  // Auth/Permissions State
  isLoadingPermissions: boolean;
  permissions: AdminPermission[];
  permissionsLoaded: boolean;
  
  // Admin functions
  setSidebar: (val: boolean) => void;
  toggleSidebar: () => void;
  setActiveSection: (section: string) => void;
  toggleDarkMode: () => void;
  setAdminTheme: (theme: string) => void;
  pinIcon: (id: string) => void;
  unpinIcon: (id: string) => void;
  setScrollY: (val: number) => void;
  setDashboardCollapsed: (collapsed: boolean) => void;
  
  // Drag and drop functions
  setHoveredIcon: (id: string | null) => void;
  setDragSource: (id: string | null) => void;
  setDragTarget: (id: string | null) => void;
  setShowDragOverlay: (show: boolean) => void;
  
  // Permission functions
  loadPermissions: (mappedPermissions?: AdminPermission[]) => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Default UI state
      sidebarExpanded: true,
      pinnedIcons: [],
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
      
      // Default auth state
      isLoadingPermissions: true,
      permissions: [],
      permissionsLoaded: false,
      
      // UI functions
      setSidebar: (val) => set({ sidebarExpanded: val }),
      toggleSidebar: () => set(state => ({ sidebarExpanded: !state.sidebarExpanded })),
      setActiveSection: (section) => set({ activeSection: section }),
      toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
      setAdminTheme: (theme) => set({ adminTheme: theme }),
      setDashboardCollapsed: (collapsed) => set({ isDashboardCollapsed: collapsed }),
      
      pinIcon: (id) => set((state) => ({
        pinnedIcons: state.pinnedIcons.includes(id) 
          ? state.pinnedIcons 
          : [...state.pinnedIcons, id]
      })),
      
      unpinIcon: (id) => set((state) => ({
        pinnedIcons: state.pinnedIcons.filter(iconId => iconId !== id)
      })),
      
      setScrollY: (val) => set({ scrollY: val }),
      
      // Drag and drop functions
      setHoveredIcon: (id) => set({ hoveredIcon: id }),
      setDragSource: (id) => set({ dragSource: id }),
      setDragTarget: (id) => set({ dragTarget: id }),
      setShowDragOverlay: (show) => set({ showDragOverlay: show }),
      
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
      partialize: (state) => ({
        sidebarExpanded: state.sidebarExpanded,
        pinnedIcons: state.pinnedIcons,
        activeSection: state.activeSection,
        isDarkMode: state.isDarkMode,
        adminTheme: state.adminTheme,
        isDashboardCollapsed: state.isDashboardCollapsed
      })
    }
  )
);
