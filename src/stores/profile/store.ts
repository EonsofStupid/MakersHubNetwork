
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth/store';

interface ProfileState {
  profile: Record<string, any> | null;
  isLoading: boolean;
  error: Error | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Record<string, any>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  
  fetchProfile: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Fetch profile from user metadata
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      set({ profile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error occurred'), 
        isLoading: false 
      });
    }
  },
  
  updateProfile: async (updates) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      set({ profile: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error occurred'), 
        isLoading: false 
      });
    }
  }
}));
