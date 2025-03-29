
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminPreferences } from '../types/admin.types';

interface AdminPreferencesState extends AdminPreferences {
  // UI state
  isDashboardCollapsed: boolean;
  
  // Actions
  setDashboardCollapsed: (collapsed: boolean) => void;
  setPinnedTools: (tools: string[]) => void;
  setTheme: (theme: string) => void;
  setActiveSection: (section: string) => void;
  
  // Load/Save preferences
  loadPreferences: () => void;
  savePreferences: () => void;
}

export const useAdminPreferences = create<AdminPreferencesState>()(
  persist(
    (set, get) => ({
      // Default preferences
      sidebarExpanded: true,
      dashboardLayout: [],
      pinnedTools: ['users', 'builds', 'themes'],
      theme: 'cyberpunk',
      activeSection: 'overview',
      
      // UI state
      isDashboardCollapsed: false,
      
      // Actions
      setDashboardCollapsed: (collapsed) => set({ isDashboardCollapsed: collapsed }),
      
      setPinnedTools: (tools) => set({ pinnedTools: tools }),
      
      setTheme: (theme) => set({ theme }),
      
      setActiveSection: (section) => set({ activeSection: section }),
      
      // Load preferences (could fetch from API in the future)
      loadPreferences: () => {
        // For now we're just using the persisted state 
        // This function exists as a hook for future API integration
        console.log('Admin preferences loaded from store');
      },
      
      // Save preferences (could save to API in the future)
      savePreferences: () => {
        // For now we're just using persisted state
        // This function exists as a hook for future API integration
        console.log('Admin preferences saved to store');
        return Promise.resolve();
      }
    }),
    {
      name: 'admin-preferences',
      // Only persist these fields
      partialize: (state) => ({
        sidebarExpanded: state.sidebarExpanded,
        dashboardLayout: state.dashboardLayout,
        pinnedTools: state.pinnedTools,
        theme: state.theme,
        activeSection: state.activeSection,
      }),
    }
  )
);
