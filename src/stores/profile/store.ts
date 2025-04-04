
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

interface Profile {
  id?: string;
  user_id?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => {
  const logger = getLogger('profileStore', { category: LogCategory.SYSTEM });
  
  return {
    profile: null,
    isLoading: false,
    error: null,
    
    fetchProfile: async (userId: string) => {
      try {
        set({ isLoading: true, error: null });
        logger.debug('Fetching profile', { details: { userId }});
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (error) throw error;
        
        set({ profile: data, isLoading: false });
        logger.debug('Profile fetched successfully', { details: { profile: data }});
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        set({ error: err, isLoading: false });
        logger.error('Error fetching profile', { details: { error: err } });
      }
    },
    
    updateProfile: async (updates: Partial<Profile>) => {
      try {
        const { profile } = get();
        if (!profile?.user_id) {
          throw new Error('No profile loaded');
        }
        
        set({ isLoading: true, error: null });
        logger.debug('Updating profile', { details: { updates }});
        
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', profile.user_id)
          .select()
          .single();
          
        if (error) throw error;
        
        set({ profile: data, isLoading: false });
        logger.debug('Profile updated successfully');
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        set({ error: err, isLoading: false });
        logger.error('Error updating profile', { details: { error: err }});
      }
    },
    
    clearProfile: () => {
      set({ profile: null, error: null });
      logger.debug('Profile cleared');
    }
  };
});
