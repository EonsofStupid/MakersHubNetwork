
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getLogger } from "@/logging";

const logger = getLogger('AdminPreferences');

interface AdminPreferences {
  theme: string;
  showSidebar: boolean;
  sidebarCollapsed: boolean;
  useCompactLayout: boolean;
  recentSearches: string[];
  favoritePages: string[];
  pinnedItems: string[];
  dashboardLayout: string;
  notificationsEnabled: boolean;
  autoSaveEnabled: boolean;
  lastSection: string;
}

interface AdminPreferencesState extends AdminPreferences {
  setTheme: (theme: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleCompactLayout: () => void;
  setUseCompactLayout: (compact: boolean) => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  toggleFavoritePage: (page: string) => void;
  togglePinnedItem: (item: string) => void;
  setDashboardLayout: (layout: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setLastSection: (section: string) => void;
  resetPreferences: () => void;
}

const INITIAL_PREFERENCES: AdminPreferences = {
  theme: 'impulsivity',
  showSidebar: true,
  sidebarCollapsed: false,
  useCompactLayout: false,
  recentSearches: [],
  favoritePages: [],
  pinnedItems: [],
  dashboardLayout: 'default',
  notificationsEnabled: true,
  autoSaveEnabled: true,
  lastSection: 'overview'
};

export const useAdminPreferences = create<AdminPreferencesState>()(
  persist(
    (set, get) => ({
      ...INITIAL_PREFERENCES,
      
      setTheme: (theme) => {
        logger.debug(`Setting admin theme to: ${theme}`);
        set({ theme });
      },
      
      toggleSidebar: () => {
        const currentValue = get().showSidebar;
        logger.debug(`Toggling sidebar visibility: ${currentValue} -> ${!currentValue}`);
        set({ showSidebar: !currentValue });
      },
      
      setSidebarCollapsed: (collapsed) => {
        logger.debug(`Setting sidebar collapsed: ${collapsed}`);
        set({ sidebarCollapsed: collapsed });
      },
      
      toggleCompactLayout: () => {
        const currentValue = get().useCompactLayout;
        logger.debug(`Toggling compact layout: ${currentValue} -> ${!currentValue}`);
        set({ useCompactLayout: !currentValue });
      },
      
      setUseCompactLayout: (compact) => {
        logger.debug(`Setting compact layout: ${compact}`);
        set({ useCompactLayout: compact });
      },
      
      addRecentSearch: (search) => {
        if (!search.trim()) return;
        
        const currentSearches = get().recentSearches;
        // Remove this search if it already exists
        const filteredSearches = currentSearches.filter(s => s !== search);
        // Add to the beginning and limit to 10 searches
        const newSearches = [search, ...filteredSearches].slice(0, 10);
        
        logger.debug(`Adding recent search: ${search}`);
        set({ recentSearches: newSearches });
      },
      
      clearRecentSearches: () => {
        logger.debug('Clearing recent searches');
        set({ recentSearches: [] });
      },
      
      toggleFavoritePage: (page) => {
        const currentFavorites = get().favoritePages;
        const isCurrentlyFavorite = currentFavorites.includes(page);
        
        let newFavorites: string[];
        if (isCurrentlyFavorite) {
          newFavorites = currentFavorites.filter(p => p !== page);
          logger.debug(`Removing page from favorites: ${page}`);
        } else {
          newFavorites = [...currentFavorites, page];
          logger.debug(`Adding page to favorites: ${page}`);
        }
        
        set({ favoritePages: newFavorites });
      },
      
      togglePinnedItem: (item) => {
        const currentPinned = get().pinnedItems;
        const isCurrentlyPinned = currentPinned.includes(item);
        
        let newPinned: string[];
        if (isCurrentlyPinned) {
          newPinned = currentPinned.filter(p => p !== item);
          logger.debug(`Unpinning item: ${item}`);
        } else {
          newPinned = [...currentPinned, item];
          logger.debug(`Pinning item: ${item}`);
        }
        
        set({ pinnedItems: newPinned });
      },
      
      setDashboardLayout: (layout) => {
        logger.debug(`Setting dashboard layout: ${layout}`);
        set({ dashboardLayout: layout });
      },
      
      setNotificationsEnabled: (enabled) => {
        logger.debug(`Setting notifications enabled: ${enabled}`);
        set({ notificationsEnabled: enabled });
      },
      
      setAutoSaveEnabled: (enabled) => {
        logger.debug(`Setting auto-save enabled: ${enabled}`);
        set({ autoSaveEnabled: enabled });
      },
      
      setLastSection: (section) => {
        logger.debug(`Setting last section: ${section}`);
        set({ lastSection: section });
      },
      
      resetPreferences: () => {
        logger.info('Resetting all admin preferences to defaults');
        set(INITIAL_PREFERENCES);
      }
    }),
    {
      name: 'admin-preferences'
    }
  )
);
