
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminPreferencesState {
  isDashboardCollapsed: boolean;
  isLoading: boolean;
  
  // Actions
  toggleDashboardCollapsed: () => Promise<void>;
  setDashboardCollapsed: (collapsed: boolean) => Promise<void>;
  loadPreferences: () => Promise<void>;
}

export const useAdminPreferencesStore = create<AdminPreferencesState>((set, get) => ({
  isDashboardCollapsed: false,
  isLoading: false,
  
  toggleDashboardCollapsed: async () => {
    const currentValue = get().isDashboardCollapsed;
    const newValue = !currentValue;
    
    // Optimistic UI update
    set({ isDashboardCollapsed: newValue });
    
    try {
      const { error } = await supabase
        .from('admin_shortcuts')
        .upsert(
          { 
            user_id: useAuthStore.getState().user?.id, 
            preferences: { is_dashboard_collapsed: newValue } 
          },
          { onConflict: 'user_id' }
        );
        
      if (error) throw error;
    } catch (error) {
      // Revert on error
      set({ isDashboardCollapsed: currentValue });
      console.error('Failed to save dashboard collapse preference:', error);
      toast.error('Failed to save preferences');
    }
  },
  
  setDashboardCollapsed: async (collapsed) => {
    if (get().isDashboardCollapsed === collapsed) return;
    
    // Optimistic UI update
    set({ isDashboardCollapsed: collapsed });
    
    try {
      const { error } = await supabase
        .from('admin_shortcuts')
        .upsert(
          { 
            user_id: useAuthStore.getState().user?.id, 
            preferences: { is_dashboard_collapsed: collapsed } 
          },
          { onConflict: 'user_id' }
        );
        
      if (error) throw error;
    } catch (error) {
      // Revert on error
      set({ isDashboardCollapsed: !collapsed });
      console.error('Failed to save dashboard collapse preference:', error);
      toast.error('Failed to save preferences');
    }
  },
  
  loadPreferences: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('admin_shortcuts')
        .select('preferences')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (data?.preferences) {
        set({ 
          isDashboardCollapsed: data.preferences.is_dashboard_collapsed === true 
        });
      }
    } catch (error) {
      console.error('Failed to load admin preferences:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));

// Import here at the bottom to avoid circular dependency
import { useAuthStore } from "@/stores/auth/store";
