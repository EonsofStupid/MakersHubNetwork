
import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";
import { AdminPermission } from "@/admin/types/admin.types";

export type AdminMode = 'standard' | 'inspector' | 'editor';
export type AdminTheme = 'impulse' | 'cyberpunk' | 'neon';

interface AdminState {
  // UI State
  sidebarExpanded: boolean;
  activeSection: string;
  adminMode: AdminMode;
  adminTheme: AdminTheme;
  secondaryNavVisible: boolean;
  quickActionBarVisible: boolean;
  
  // Permission State
  permissions: string[];
  isLoadingPermissions: boolean;
  
  // Admin UI Actions
  toggleSidebar: () => void;
  setSidebar: (expanded: boolean) => void;
  setActiveSection: (section: string) => void;
  setAdminMode: (mode: AdminMode) => void;
  setAdminTheme: (theme: AdminTheme) => void;
  toggleSecondaryNav: () => void;
  toggleQuickActionBar: () => void;
  
  // Permission Actions
  loadPermissions: () => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Default UI state
      sidebarExpanded: true,
      activeSection: 'overview',
      adminMode: 'standard',
      adminTheme: 'impulse',
      secondaryNavVisible: true,
      quickActionBarVisible: true,
      
      // Default permission state
      permissions: [],
      isLoadingPermissions: false,
      
      // UI Actions
      toggleSidebar: () => set(state => ({ sidebarExpanded: !state.sidebarExpanded })),
      setSidebar: (expanded: boolean) => set({ sidebarExpanded: expanded }),
      setActiveSection: (section: string) => set({ activeSection: section }),
      setAdminMode: (mode: AdminMode) => set({ adminMode: mode }),
      setAdminTheme: (theme: AdminTheme) => set({ adminTheme: theme }),
      toggleSecondaryNav: () => set(state => ({ secondaryNavVisible: !state.secondaryNavVisible })),
      toggleQuickActionBar: () => set(state => ({ quickActionBarVisible: !state.quickActionBarVisible })),
      
      // Permission actions
      loadPermissions: async () => {
        set({ isLoadingPermissions: true });
        
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            set({ permissions: [], isLoadingPermissions: false });
            return;
          }
          
          // For development, add admin permission directly
          // In production, you would query the database for actual permissions
          const defaultPerms = [
            'admin:access', 
            'admin:view', 
            'content:edit',
            'users:view',
            'users:edit',
            'builds:approve',
            'themes:edit'
          ];
          
          set({ 
            permissions: defaultPerms,
            isLoadingPermissions: false
          });
        } catch (error) {
          console.error("Error loading admin permissions:", error);
          set({ isLoadingPermissions: false });
        }
      },
      
      hasPermission: (permission: AdminPermission) => {
        // Super admin has all permissions
        if (get().permissions.includes('super_admin:all')) return true;
        
        // Check for exact permission match
        return get().permissions.includes(permission);
      }
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        sidebarExpanded: state.sidebarExpanded,
        activeSection: state.activeSection,
        adminMode: state.adminMode,
        adminTheme: state.adminTheme,
        secondaryNavVisible: state.secondaryNavVisible,
        quickActionBarVisible: state.quickActionBarVisible
      })
    }
  )
);
