
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAdminPersistMiddleware } from '../middleware/persist.middleware';

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
}

export const useAdminPreferences = create<AdminPreferencesState>()(
  persist(
    (set) => ({
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
    }),
    createAdminPersistMiddleware('admin-preferences')
  )
);
