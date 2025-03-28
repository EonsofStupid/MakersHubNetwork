
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminPreferencesState {
  isDashboardCollapsed: boolean;
  isDarkMode: boolean;
  preferredTheme: string;
  gridSize: 'compact' | 'normal' | 'comfortable';
  
  // Functions
  setDashboardCollapsed: (collapsed: boolean) => void;
  toggleDashboardCollapsed: () => void;
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
  setPreferredTheme: (theme: string) => void;
  setGridSize: (size: 'compact' | 'normal' | 'comfortable') => void;
  loadPreferences: () => void;
}

export const useAdminPreferences = create<AdminPreferencesState>()(
  persist(
    (set, get) => ({
      isDashboardCollapsed: false,
      isDarkMode: true,
      preferredTheme: 'cyberpunk',
      gridSize: 'normal',
      
      setDashboardCollapsed: (collapsed) => set({ isDashboardCollapsed: collapsed }),
      toggleDashboardCollapsed: () => set((state) => ({ isDashboardCollapsed: !state.isDashboardCollapsed })),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setPreferredTheme: (theme) => set({ preferredTheme: theme }),
      setGridSize: (size) => set({ gridSize: size }),
      
      loadPreferences: () => {
        // This function could load preferences from an API in the future
        // For now, it uses the persisted state from zustand
        console.log("Admin preferences loaded:", {
          theme: get().preferredTheme,
          darkMode: get().isDarkMode,
          gridSize: get().gridSize
        });
      }
    }),
    {
      name: 'admin-preferences',
      partialize: (state) => ({
        isDashboardCollapsed: state.isDashboardCollapsed,
        isDarkMode: state.isDarkMode,
        preferredTheme: state.preferredTheme,
        gridSize: state.gridSize,
      }),
    }
  )
);
