
import { PersistOptions } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

type StorageValue<T> = {
  state: T;
  version?: number;
};

/**
 * Creates a custom Zustand middleware for persisting state
 * that syncs with both localStorage and the Supabase database
 */
export function createAdminPersistMiddleware<T>(storeName: string): PersistOptions<T, T> {
  // Create custom state storage
  const storage = {
    getItem: async (name: string): Promise<string | null> => {
      // First try to get from localStorage for fast initial load
      const localValue = localStorage.getItem(name);
      
      try {
        // Check authentication status
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // If authenticated, try to get from Supabase
          const { data, error } = await supabase
            .from('admin_shortcuts')
            .select('shortcuts')
            .eq('user_id', user.id)
            .single();
            
          if (error) {
            console.warn('Failed to load from DB, using localStorage:', error.message);
            return localValue;
          }
          
          if (data && data.shortcuts) {
            // Store in localStorage for next time
            const serialized = JSON.stringify(data.shortcuts);
            localStorage.setItem(name, serialized);
            return serialized;
          }
        }
      } catch (err) {
        console.error('Error accessing Supabase for state:', err);
      }
      
      // Fall back to localStorage
      return localValue;
    },
    
    setItem: async (name: string, value: string): Promise<void> => {
      // Always update localStorage
      localStorage.setItem(name, value);
      
      try {
        // Check authentication status
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Parse and store in Supabase
          const parsedValue = JSON.parse(value);
          
          const { error } = await supabase
            .from('admin_shortcuts')
            .upsert({
              user_id: user.id,
              shortcuts: parsedValue,
              updated_at: new Date().toISOString()
            }, { 
              onConflict: 'user_id'
            });
            
          if (error) {
            console.error('Failed to sync state to DB:', error.message);
          }
        }
      } catch (err) {
        console.error('Error accessing Supabase for state storage:', err);
      }
    },
    
    removeItem: async (name: string): Promise<void> => {
      // Remove from localStorage
      localStorage.removeItem(name);
      
      try {
        // Check authentication status
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Remove from Supabase
          const { error } = await supabase
            .from('admin_shortcuts')
            .update({ shortcuts: null })
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Failed to remove state from DB:', error.message);
          }
        }
      } catch (err) {
        console.error('Error accessing Supabase for state removal:', err);
      }
    }
  };
  
  return {
    name: storeName,
    storage: {
      getItem: async (name) => {
        const value = await storage.getItem(name);
        if (!value) return null;
        
        try {
          // Convert string to StorageValue<T>
          const parsed = JSON.parse(value);
          return { state: parsed };
        } catch (e) {
          console.error('Error parsing persisted state:', e);
          return null;
        }
      },
      setItem: async (name, value) => {
        await storage.setItem(name, JSON.stringify(value.state));
      },
      removeItem: async (name) => {
        await storage.removeItem(name);
      }
    },
    partialize: (state) => {
      const keysToSave = [
        'sidebarExpanded',
        'activeSection',
        'adminTheme',
        'isDarkMode',
        'showLabels',
        'dashboardShortcuts',
        'pinnedTopNavItems'
      ];
      
      const partialState = Object.entries(state as object).reduce((acc, [key, value]) => {
        if (keysToSave.includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      return partialState as T;
    },
  };
}
