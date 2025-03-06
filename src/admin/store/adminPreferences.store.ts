
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth/store';

interface AdminPreferencesState {
  isDashboardCollapsed: boolean;
  isLoading: boolean;
  setDashboardCollapsed: (collapsed: boolean) => void;
  loadPreferences: () => Promise<void>;
  routerPreference: 'legacy' | 'tanstack';
  setRouterPreference: (preference: 'legacy' | 'tanstack') => void;
}

export const useAdminPreferences = create<AdminPreferencesState>((set, get) => ({
  isDashboardCollapsed: false,
  isLoading: true,
  routerPreference: 'legacy',
  
  setRouterPreference: (preference: 'legacy' | 'tanstack') => {
    set({ routerPreference: preference });
  },
  
  loadPreferences: async () => {
    set({ isLoading: true });
    
    const { user } = useAuthStore.getState();
    if (!user?.id) {
      set({ isLoading: false });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('admin_shortcuts')
        .select('shortcuts')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error("Error loading preferences:", error);
        set({ isLoading: false });
        return;
      }
      
      // If data exists, try to extract dashboard collapse state
      if (data && data.shortcuts) {
        // Check if shortcuts has metadata with dashboard_collapsed property
        const shortcutsData = data.shortcuts as any;
        if (shortcutsData._meta && typeof shortcutsData._meta.dashboard_collapsed === 'boolean') {
          set({ 
            isDashboardCollapsed: shortcutsData._meta.dashboard_collapsed,
            routerPreference: shortcutsData._meta.router_preference || 'legacy',
            isLoading: false 
          });
          return;
        }
      }
      
      // Default state
      set({ isLoading: false });
    } catch (error) {
      console.error("Error in loadPreferences:", error);
      set({ isLoading: false });
    }
  },
  
  setDashboardCollapsed: async (collapsed: boolean) => {
    set({ isDashboardCollapsed: collapsed });
    
    const { user } = useAuthStore.getState();
    if (!user?.id) return;
    
    try {
      // First fetch current shortcuts
      const { data, error } = await supabase
        .from('admin_shortcuts')
        .select('shortcuts')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error("Error fetching shortcuts for preference update:", error);
        return;
      }
      
      // Prepare updated shortcuts data with metadata
      const currentShortcuts = data?.shortcuts || [];
      let updatedShortcuts: any;
      
      if (Array.isArray(currentShortcuts)) {
        // Add metadata to the array
        updatedShortcuts = [...currentShortcuts];
        // Add _meta property if it doesn't exist
        updatedShortcuts._meta = {
          ...(currentShortcuts._meta || {}),
          dashboard_collapsed: collapsed,
          router_preference: get().routerPreference
        };
      } else {
        // Handle case where shortcuts is an object
        updatedShortcuts = {
          ...(currentShortcuts as object),
          _meta: {
            ...(currentShortcuts._meta || {}),
            dashboard_collapsed: collapsed,
            router_preference: get().routerPreference
          }
        };
      }
      
      // Update the record
      const { error: updateError } = await supabase
        .from('admin_shortcuts')
        .upsert({
          user_id: user.id,
          shortcuts: updatedShortcuts
        }, { onConflict: 'user_id' });
      
      if (updateError) {
        console.error("Error updating preferences:", updateError);
      }
    } catch (error) {
      console.error("Error in setDashboardCollapsed:", error);
    }
  }
}));
