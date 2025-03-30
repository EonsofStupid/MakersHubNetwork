
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { PersistOptions, StorageValue, StateStorage } from "zustand/middleware";

/**
 * Custom storage adapter for zustand persist middleware
 */
const createCustomStorage = (storeName: string): StateStorage => ({
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name);
      return value;
    } catch (error) {
      console.error(`Error retrieving ${storeName} preferences:`, error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error(`Error saving ${storeName} preferences:`, error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing ${storeName} preferences:`, error);
    }
  },
});

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
        loadPermissions,
        hasPermission,
        ...persistedState
      } = state;
      return persistedState;
    },

    storage: createCustomStorage(storeName),
  };
}

/**
 * Helper function to merge localStorage and database preferences
 */
export function mergePreferences(localData: any, dbData: any): any {
  const {
    id,
    user_id,
    created_at,
    updated_at,
    ...dbPreferences
  } = dbData;

  const formattedDbPrefs = formatFromDatabase(dbPreferences);

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
      isDarkMode: storeData.isDarkMode
    }
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
    isDarkMode: dbData.ui_preferences?.isDarkMode
  };
}
