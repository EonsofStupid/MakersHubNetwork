
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { PersistOptions, StorageValue } from "zustand/middleware";

// Define type for the storage adapter
interface CustomStorage {
  getItem: (name: string) => Promise<string | null> | string | null;
  setItem: (name: string, value: string) => Promise<void> | void;
  removeItem: (name: string) => Promise<void> | void;
}

/**
 * Middleware for syncing admin preferences between localStorage and database
 */
export function createAdminPersistMiddleware(storeName: string): PersistOptions<any, any> {
  return {
    name: storeName,
    
    onRehydrateStorage: (state: any) => {
      return (rehydratedState: any, error: any) => {
        if (error) {
          console.error(`Error rehydrating ${storeName}:`, error);
        }
      };
    },

    // Filter out what we want to persist to localStorage
    partialize: (state: any) => {
      // Only persist UI preferences to localStorage, exclude function properties
      const { permissions, isLoadingPermissions, loadPermissions, hasPermission, ...persistedState } = state;
      return persistedState;
    },

    // Custom storage adapter that syncs with Supabase
    storage: {
      getItem: async (name: string): Promise<string | null> => {
        try {
          // First try localStorage
          const localData = localStorage.getItem(name);
          
          // If user is authenticated, also fetch from database
          const { user } = useAuthStore.getState();
          
          if (user?.id) {
            const { data, error } = await supabase
              .from('admin_shortcuts')
              .select('*')
              .eq('user_id', user.id)
              .single();
              
            if (error) {
              console.warn('Failed to fetch admin preferences from database:', error.message);
              // Fall back to localStorage data
              return localData;
            }
            
            if (data) {
              // If we have data from the database, use it and update localStorage
              const mergedData = mergePreferences(
                localData ? JSON.parse(localData) : {},
                data
              );
              
              // Update localStorage with merged data
              localStorage.setItem(name, JSON.stringify(mergedData));
              
              return JSON.stringify(mergedData);
            }
          }
          
          return localData;
        } catch (error) {
          console.error('Error retrieving admin preferences:', error);
          return localStorage.getItem(name);
        }
      },
      
      setItem: async (name: string, value: string): Promise<void> => {
        try {
          // Always update localStorage first
          localStorage.setItem(name, value);
          
          // Then sync to database if user is authenticated
          const { user } = useAuthStore.getState();
          const valueObj = JSON.parse(value);
          
          if (user?.id) {
            // Convert the data to match the database schema
            const dbData = formatForDatabase(valueObj);
            
            const { error } = await supabase
              .from('admin_shortcuts')
              .upsert({
                user_id: user.id,
                ...dbData
              }, { 
                onConflict: 'user_id'
              });
              
            if (error) {
              console.error('Failed to save admin preferences to database:', error.message);
              // Use imported toast function directly
              const { toast } = useToast();
              toast({
                title: "Sync Failed",
                description: "Your preferences couldn't be saved to the cloud",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error('Error saving admin preferences:', error);
          localStorage.setItem(name, value);
        }
      },
      
      removeItem: async (name: string): Promise<void> => {
        try {
          localStorage.removeItem(name);
          
          const { user } = useAuthStore.getState();
          
          if (user?.id) {
            const { error } = await supabase
              .from('admin_shortcuts')
              .delete()
              .eq('user_id', user.id);
              
            if (error) {
              console.error('Failed to delete admin preferences from database:', error.message);
            }
          }
        } catch (error) {
          console.error('Error removing admin preferences:', error);
          localStorage.removeItem(name);
        }
      },
    } as CustomStorage
  };
}

/**
 * Helper function to merge localStorage and database preferences
 */
function mergePreferences(localData: any, dbData: any): any {
  // Extract the relevant fields from the database record
  const {
    id,
    user_id,
    created_at,
    updated_at,
    ...dbPreferences
  } = dbData;
  
  // Convert database column format back to store format
  const formattedDbPrefs = formatFromDatabase(dbPreferences);
  
  // Merge with local data, preferring database values
  return {
    ...localData,
    ...formattedDbPrefs,
  };
}

/**
 * Format store data to match database schema
 */
function formatForDatabase(storeData: any): any {
  return {
    sidebar_expanded: storeData.sidebarExpanded,
    topnav_items: storeData.pinnedTopNavItems,
    dashboard_items: storeData.pinnedDashboardItems,
    active_section: storeData.activeSection,
    dashboard_collapsed: storeData.isDashboardCollapsed,
    theme_preference: storeData.adminTheme,
    frozen_zones: storeData.frozenZones,
    ui_preferences: {
      isDarkMode: storeData.isDarkMode
    }
  };
}

/**
 * Format database data to match store schema
 */
function formatFromDatabase(dbData: any): any {
  return {
    sidebarExpanded: dbData.sidebar_expanded,
    pinnedTopNavItems: dbData.topnav_items || [],
    pinnedDashboardItems: dbData.dashboard_items || [],
    activeSection: dbData.active_section,
    isDashboardCollapsed: dbData.dashboard_collapsed,
    adminTheme: dbData.theme_preference,
    frozenZones: dbData.frozen_zones || [],
    isDarkMode: dbData.ui_preferences?.isDarkMode
  };
}
