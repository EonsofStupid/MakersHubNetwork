
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { PersistOptions, StorageValue } from "zustand/middleware";

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
      const {
        permissions,
        isLoadingPermissions,
        permissionsLoaded,
        loadPermissions,
        hasPermission,
        setState,
        ...persistedState
      } = state;
      return persistedState;
    },

    // Zustand-compatible localStorage adapter
    storage: {
      getItem: (name: string): StorageValue<any> | Promise<StorageValue<any> | null> | null => {
        try {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        } catch (error) {
          console.error('Error retrieving admin preferences:', error);
          return null;
        }
      },

      setItem: (name: string, value: StorageValue<any>): void | Promise<void> => {
        try {
          localStorage.setItem(name, JSON.stringify(value));
        } catch (error) {
          console.error('Error saving admin preferences:', error);
        }
      },

      removeItem: (name: string): void | Promise<void> => {
        try {
          localStorage.removeItem(name);
        } catch (error) {
          console.error('Error removing admin preferences:', error);
        }
      },
    },
  };
}

/**
 * Helper function to merge localStorage and database preferences
 */
export function mergePreferences(localData: any, dbData: any): any {
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
export function formatForDatabase(storeData: any): any {
  return {
    sidebar_expanded: storeData.sidebarExpanded,
    topnav_items: storeData.pinnedTopNavItems,
    dashboard_items: storeData.pinnedDashboardItems,
    active_section: storeData.activeSection,
    dashboard_collapsed: storeData.isDashboardCollapsed,
    theme_preference: storeData.adminTheme,
    frozen_zones: storeData.frozenZones,
    ui_preferences: {
      isDarkMode: storeData.isDarkMode,
      isEditMode: storeData.isEditMode
    },
  };
}

/**
 * Format database data to match store schema
 */
export function formatFromDatabase(dbData: any): any {
  return {
    sidebarExpanded: dbData.sidebar_expanded,
    pinnedTopNavItems: dbData.topnav_items || [],
    pinnedDashboardItems: dbData.dashboard_items || [],
    activeSection: dbData.active_section,
    isDashboardCollapsed: dbData.dashboard_collapsed,
    adminTheme: dbData.theme_preference,
    frozenZones: dbData.frozen_zones || [],
    isDarkMode: dbData.ui_preferences?.isDarkMode ?? true,
    isEditMode: dbData.ui_preferences?.isEditMode ?? false,
  };
}
