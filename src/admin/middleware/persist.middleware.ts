
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { PersistOptions, StateStorage } from "zustand/middleware";

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
      getItem: (name: string): string | null => {
        try {
          // First try localStorage
          return localStorage.getItem(name);
        } catch (error) {
          console.error('Error retrieving admin preferences:', error);
          return null;
        }
      },
      
      setItem: (name: string, value: string): void => {
        try {
          // Always update localStorage first
          localStorage.setItem(name, value);
        } catch (error) {
          console.error('Error saving admin preferences:', error);
        }
      },
      
      removeItem: (name: string): void => {
        try {
          localStorage.removeItem(name);
        } catch (error) {
          console.error('Error removing admin preferences:', error);
        }
      },
    } as StateStorage
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
