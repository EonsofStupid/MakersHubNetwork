
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth/store';

interface AdminPreferences {
  dashboard_collapsed?: boolean;
  router_preference?: 'tanstack' | 'react-router';
}

interface ShortcutsData {
  shortcuts: any[];
  _meta?: AdminPreferences;
}

interface AdminPreferencesState {
  isDashboardCollapsed: boolean;
  isLoading: boolean;
  routerPreference: 'tanstack' | 'react-router';
  setDashboardCollapsed: (collapsed: boolean) => void;
  loadPreferences: () => Promise<void>;
  setRouterPreference: (preference: 'tanstack' | 'react-router') => void;
}

export const useAdminPreferences = create<AdminPreferencesState>((set, get) => ({
  isDashboardCollapsed: false,
  isLoading: true,
  routerPreference: 'tanstack', // Set TanStack as default
  
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
      
      // If data exists, extract preferences
      if (data && data.shortcuts) {
        // Check if shortcuts has metadata for preferences
        const shortcutsData = data.shortcuts as any;
        
        // Safely access the _meta property
        if (shortcutsData && typeof shortcutsData === 'object' && shortcutsData._meta) {
          const meta = shortcutsData._meta as AdminPreferences;
          set({ 
            isDashboardCollapsed: meta.dashboard_collapsed ?? false,
            routerPreference: meta.router_preference ?? 'tanstack',
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
        // Create a new object with both the array and the _meta property
        updatedShortcuts = [...(currentShortcuts as any[])];
        
        // Add _meta as a separate property of the object
        Object.defineProperty(updatedShortcuts, '_meta', {
          enumerable: true,
          value: {
            dashboard_collapsed: collapsed,
            router_preference: get().routerPreference
          }
        });
      } else if (typeof currentShortcuts === 'object') {
        // Handle case where shortcuts is already an object
        updatedShortcuts = {
          ...(currentShortcuts as Record<string, any>),
          _meta: {
            ...((currentShortcuts as any)._meta || {}),
            dashboard_collapsed: collapsed,
            router_preference: get().routerPreference
          }
        };
      } else {
        // If it's neither array nor object, create a new object structure
        updatedShortcuts = {
          items: [],
          _meta: {
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
  },
  
  setRouterPreference: async (preference: 'tanstack' | 'react-router') => {
    set({ routerPreference: preference });
    
    const { user } = useAuthStore.getState();
    if (!user?.id) return;
    
    try {
      // First fetch current shortcuts
      const { data, error } = await supabase
        .from('admin_shortcuts')
        .select('shortcuts')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching shortcuts for router preference update:", error);
        return;
      }
      
      // Prepare updated shortcuts data with metadata
      const currentShortcuts = data?.shortcuts || [];
      let updatedShortcuts: any;
      
      if (Array.isArray(currentShortcuts)) {
        updatedShortcuts = [...(currentShortcuts as any[])];
        
        Object.defineProperty(updatedShortcuts, '_meta', {
          enumerable: true,
          value: {
            dashboard_collapsed: get().isDashboardCollapsed,
            router_preference: preference
          }
        });
      } else if (typeof currentShortcuts === 'object') {
        updatedShortcuts = {
          ...(currentShortcuts as Record<string, any>),
          _meta: {
            ...((currentShortcuts as any)._meta || {}),
            dashboard_collapsed: get().isDashboardCollapsed,
            router_preference: preference
          }
        };
      } else {
        updatedShortcuts = {
          items: [],
          _meta: {
            dashboard_collapsed: get().isDashboardCollapsed,
            router_preference: preference
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
        console.error("Error updating router preference:", updateError);
      }
    } catch (error) {
      console.error("Error in setRouterPreference:", error);
    }
  }
}));
