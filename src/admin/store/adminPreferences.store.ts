
import { create } from 'zustand';
import { createAdminPersistMiddleware } from '../middleware/persist.middleware';
import { persist } from 'zustand/middleware';

interface AdminPreferencesState {
  // UI Preferences
  isDashboardCollapsed: boolean;
  activeDashboardLayout: string;
  pinnedTools: string[];
  recentViews: string[];

  // Theme Preferences
  theme: string;
  
  // Actions
  setDashboardCollapsed: (collapsed: boolean) => void;
  setDashboardLayout: (layout: string) => void;
  setPinnedTools: (tools: string[]) => void;
  addRecentView: (path: string) => void;
  setTheme: (theme: string) => void;
  
  // Load/Save preferences
  loadPreferences: () => void;
  savePreferences: () => void;
}

export const useAdminPreferences = create<AdminPreferencesState>()(
  persist(
    (set, get) => ({
      // Default Preferences
      isDashboardCollapsed: false,
      activeDashboardLayout: 'default',
      pinnedTools: [],
      recentViews: [],
      theme: 'cyberpunk',
      
      // Actions
      setDashboardCollapsed: (collapsed) => set({ isDashboardCollapsed: collapsed }),
      setDashboardLayout: (layout) => set({ activeDashboardLayout: layout }),
      setPinnedTools: (tools) => set({ pinnedTools: tools }),
      setTheme: (theme) => set({ theme }),
      
      addRecentView: (path) => set((state) => {
        const existingViews = state.recentViews.filter(v => v !== path);
        return { 
          recentViews: [path, ...existingViews].slice(0, 10) 
        };
      }),
      
      // Load/Save preferences
      loadPreferences: () => {
        console.log("Admin preferences loaded");
        // This function is primarily to provide a hook for future expansion
        // When preferences are stored in persistence, they're loaded automatically
      },
      
      savePreferences: () => {
        console.log("Admin preferences saved");
        // This function is primarily to provide a hook for future expansion
        // When state changes, persist middleware saves automatically
      }
    }),
    createAdminPersistMiddleware('admin-preferences')
  )
);
