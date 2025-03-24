
import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";

interface AdminState {
  // UI state
  sidebarExpanded: boolean;
  activeSection: string;
  adminMode: 'standard' | 'inspector' | 'editor';
  
  // Permission state
  permissions: string[];
  isLoadingPermissions: boolean;
  
  // UI Actions
  toggleSidebar: () => void;
  setSidebar: (expanded: boolean) => void;
  setActiveSection: (section: string) => void;
  setAdminMode: (mode: 'standard' | 'inspector' | 'editor') => void;
  
  // Permission actions
  loadPermissions: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Default UI state
      sidebarExpanded: true,
      activeSection: 'overview',
      adminMode: 'standard',
      
      // Default permission state
      permissions: [],
      isLoadingPermissions: false,
      
      // UI Actions
      toggleSidebar: () => set(state => ({ sidebarExpanded: !state.sidebarExpanded })),
      setSidebar: (expanded: boolean) => set({ sidebarExpanded: expanded }),
      setActiveSection: (section: string) => set({ activeSection: section }),
      setAdminMode: (mode) => set({ adminMode: mode }),
      
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
          const defaultPerms = ['admin:access', 'admin:view', 'content:edit'];
          
          set({ 
            permissions: defaultPerms,
            isLoadingPermissions: false
          });
        } catch (error) {
          console.error("Error loading admin permissions:", error);
          set({ isLoadingPermissions: false });
        }
      },
      
      hasPermission: (permission: string) => {
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
        adminMode: state.adminMode
      })
    }
  )
);
