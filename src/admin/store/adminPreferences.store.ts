
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth/store';
import { Json } from '@/integrations/supabase/types';

interface AdminPreferences {
  dashboard_collapsed?: boolean;
  router_preference?: string;
}

// Define a more specific type for shortcuts data
interface ShortcutsData {
  _meta?: AdminPreferences;
  items?: any[];
  [key: string]: any;
}

interface AdminPreferencesState {
  isDashboardCollapsed: boolean;
  routerPreference: 'react-router' | 'tanstack';
  isLoading: boolean;
  setDashboardCollapsed: (collapsed: boolean) => void;
  setRouterPreference: (preference: 'react-router' | 'tanstack') => void;
  loadPreferences: () => Promise<void>;
}

export const useAdminPreferences = create<AdminPreferencesState>((set, get) => ({
  isDashboardCollapsed: false,
  routerPreference: 'react-router',
  isLoading: true,
  
  loadPreferences: async () => {
    set({ isLoading: true });
    
    try {
      const { user } = useAuthStore.getState();
      if (!user?.id) {
        console.log("No user ID found when loading admin preferences");
        set({ isLoading: false });
        return;
      }
      
      console.log("Loading preferences for user:", user.id);
      
      const { data, error } = await supabase
        .from('admin_shortcuts')
        .select('shortcuts')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error loading preferences:", error);
        set({ isLoading: false });
        return;
      }
      
      // If data exists, try to extract preferences
      if (data && data.shortcuts) {
        // Check if shortcuts has metadata for preferences
        const shortcutsData = data.shortcuts;
        
        console.log("Loaded preferences data:", shortcutsData);
        
        // Safely access the _meta property with proper type checking
        if (shortcutsData && typeof shortcutsData === 'object' && !Array.isArray(shortcutsData)) {
          // Now we can safely typecast shortcutsData
          const typedShortcuts = shortcutsData as ShortcutsData;
          
          if (typedShortcuts._meta) {
            set({ 
              isDashboardCollapsed: typedShortcuts._meta.dashboard_collapsed ?? false,
              routerPreference: (typedShortcuts._meta.router_preference as 'react-router' | 'tanstack') ?? 'react-router',
              isLoading: false 
            });
            return;
          }
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
    
    try {
      const { user } = useAuthStore.getState();
      if (!user?.id) {
        console.log("No user ID found when saving preferences");
        return;
      }
      
      // First fetch current shortcuts
      const { data, error } = await supabase
        .from('admin_shortcuts')
        .select('shortcuts')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error("Error fetching shortcuts for preference update:", error);
        return;
      }
      
      // Prepare updated shortcuts data with metadata
      const currentShortcuts = data?.shortcuts;
      let updatedShortcuts: Record<string, any> = {};
      
      if (Array.isArray(currentShortcuts)) {
        // Create a new object that includes the array data 
        // but add _meta as a separate property
        updatedShortcuts = {
          items: [...currentShortcuts],
          _meta: {
            dashboard_collapsed: collapsed,
            router_preference: get().routerPreference
          }
        };
      } else if (typeof currentShortcuts === 'object' && currentShortcuts !== null) {
        // Handle case where shortcuts is already an object
        updatedShortcuts = {
          ...(currentShortcuts as Record<string, any>),
          _meta: {
            ...((currentShortcuts as ShortcutsData)._meta || {}),
            dashboard_collapsed: collapsed
          }
        };
      } else {
        // If it's neither array nor object, create a new object structure
        updatedShortcuts = {
          items: [],
          _meta: {
            dashboard_collapsed: collapsed
          }
        };
      }
      
      console.log("Saving preferences:", updatedShortcuts);
      
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
  
  setRouterPreference: async (preference: 'react-router' | 'tanstack') => {
    set({ routerPreference: preference });
    
    try {
      const { user } = useAuthStore.getState();
      if (!user?.id) return;
      
      // First fetch current shortcuts
      const { data, error } = await supabase
        .from('admin_shortcuts')
        .select('shortcuts')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching shortcuts for router preference update:", error);
        return;
      }
      
      // Similar logic as in setDashboardCollapsed
      const currentShortcuts = data?.shortcuts;
      let updatedShortcuts: Record<string, any> = {};
      
      if (Array.isArray(currentShortcuts)) {
        updatedShortcuts = {
          items: [...currentShortcuts],
          _meta: {
            router_preference: preference,
            dashboard_collapsed: get().isDashboardCollapsed
          }
        };
      } else if (typeof currentShortcuts === 'object' && currentShortcuts !== null) {
        updatedShortcuts = {
          ...(currentShortcuts as Record<string, any>),
          _meta: {
            ...((currentShortcuts as ShortcutsData)._meta || {}),
            router_preference: preference
          }
        };
      } else {
        updatedShortcuts = {
          items: [],
          _meta: {
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
