
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/store";

/**
 * Service to handle admin data operations
 */
export const AdminDataService = {
  /**
   * Saves admin preferences to the database
   * @param userId User ID
   * @param data Admin preferences data
   */
  async savePreferences(userId: string, data: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admin_shortcuts')
        .upsert({
          user_id: userId,
          ...data
        }, {
          onConflict: 'user_id',
          returning: 'minimal'
        });

      if (error) {
        console.error('Failed to save admin preferences:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error saving admin preferences:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Loads admin preferences from the database
   * @param userId User ID
   */
  async loadPreferences(userId: string): Promise<{ data: any | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('admin_shortcuts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Failed to load admin preferences:', error.message);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error: any) {
      console.error('Error loading admin preferences:', error.message);
      return { data: null, error: error.message };
    }
  }
};

/**
 * Hook to handle automatic syncing of admin data
 * @param data Data to sync
 * @param onChange Callback when data changes
 */
export function useAdminDataSync<T>(data: T, onChange: (data: T) => void) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedData, setLastSyncedData] = useState<T | null>(null);
  
  // Debounce data changes to avoid excessive database calls
  const debouncedData = useDebounce(data, 2000);
  
  useEffect(() => {
    let isMounted = true;
    
    const syncData = async () => {
      if (!user?.id || JSON.stringify(debouncedData) === JSON.stringify(lastSyncedData)) {
        return;
      }
      
      setIsSyncing(true);
      
      try {
        // Load existing data first
        const { data: existingData } = await AdminDataService.loadPreferences(user.id);
        
        // Merge with new data
        const mergedData = {
          ...(existingData || {}),
          ...debouncedData
        };
        
        // Save to database
        const { success, error } = await AdminDataService.savePreferences(user.id, mergedData);
        
        if (!success && error && isMounted) {
          toast({
            title: "Sync Failed",
            description: "Your preferences couldn't be saved to the cloud",
            variant: "destructive",
          });
        }
        
        if (isMounted) {
          setLastSyncedData(debouncedData as T);
        }
      } catch (error) {
        console.error('Error syncing admin data:', error);
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    };
    
    syncData();
    
    return () => {
      isMounted = false;
    };
  }, [debouncedData, user?.id, toast, lastSyncedData]);
  
  // Load initial data
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (!user?.id) return;
      
      try {
        const { data: storedData, error } = await AdminDataService.loadPreferences(user.id);
        
        if (error) {
          console.warn('Failed to load initial admin data:', error);
          return;
        }
        
        if (storedData && isMounted) {
          onChange(storedData as T);
          setLastSyncedData(storedData as T);
        }
      } catch (error) {
        console.error('Error loading initial admin data:', error);
      }
    };
    
    loadInitialData();
    
    return () => {
      isMounted = false;
    };
  }, [user?.id, onChange]);
  
  return { isSyncing };
}
