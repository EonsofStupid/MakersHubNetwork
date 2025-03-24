
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

interface AdminState {
  // UI state
  sidebarExpanded: boolean;
  currentSection: string;
  
  // Permission state
  permissions: string[];
  isLoadingPermissions: boolean;
  
  // UI Actions
  toggleSidebar: () => void;
  setSidebar: (expanded: boolean) => void;
  setCurrentSection: (section: string) => void;
  
  // Permission actions
  loadPermissions: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Default UI state
  sidebarExpanded: true,
  currentSection: 'dashboard',
  
  // Default permission state
  permissions: [],
  isLoadingPermissions: true,
  
  // UI Actions
  toggleSidebar: () => set(state => ({ sidebarExpanded: !state.sidebarExpanded })),
  setSidebar: (expanded: boolean) => set({ sidebarExpanded: expanded }),
  setCurrentSection: (section: string) => set({ currentSection: section }),
  
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
      
      // Get user roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (!userRoles || userRoles.length === 0) {
        set({ permissions: [], isLoadingPermissions: false });
        return;
      }
      
      // Get permissions for the user's roles
      const roles = userRoles.map(ur => ur.role);
      const { data: permissions } = await supabase
        .from('role_permissions')
        .select('action, subject')
        .in('role', roles);
      
      // Transform permissions into a simple string array
      const permissionStrings = permissions
        ? permissions.map(p => `${p.action}:${p.subject}`)
        : [];
      
      // Add admin:access permission for anyone with admin or super_admin role
      if (roles.includes('admin') || roles.includes('super_admin')) {
        permissionStrings.push('admin:access');
      }
      
      set({ 
        permissions: permissionStrings,
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
}));
