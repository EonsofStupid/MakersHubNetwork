
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminPreferencesState {
  // UI preferences
  isDashboardCollapsed: boolean;
  sidebarPosition: 'left' | 'right';
  themeVariant: 'cyberpunk' | 'neon' | 'corporate';
  
  // Feature preferences
  showQuickActions: boolean;
  usedInspector: boolean;
  enableAnimations: boolean;
  
  // User settings
  lastVisitedSection: string;
  pinnedShortcuts: string[];
  customTokens: Record<string, string>;
}

export interface AdminPreferencesActions {
  setDashboardCollapsed: (collapsed: boolean) => void;
  setSidebarPosition: (position: 'left' | 'right') => void;
  setThemeVariant: (variant: 'cyberpunk' | 'neon' | 'corporate') => void;
  setShowQuickActions: (show: boolean) => void;
  setUsedInspector: (used: boolean) => void;
  setEnableAnimations: (enable: boolean) => void;
  setLastVisitedSection: (section: string) => void;
  addPinnedShortcut: (shortcut: string) => void;
  removePinnedShortcut: (shortcut: string) => void;
  setCustomToken: (key: string, value: string) => void;
  loadPreferences: () => void;
}

export type AdminPreferencesStore = AdminPreferencesState & AdminPreferencesActions;

export const useAdminPreferences = create<AdminPreferencesStore>()(
  persist(
    (set, get) => ({
      // Default UI preferences
      isDashboardCollapsed: false,
      sidebarPosition: 'left',
      themeVariant: 'cyberpunk',
      
      // Default feature preferences
      showQuickActions: true,
      usedInspector: false,
      enableAnimations: true,
      
      // Default user settings
      lastVisitedSection: 'overview',
      pinnedShortcuts: ['users', 'builds', 'themes'],
      customTokens: {},
      
      // Actions
      setDashboardCollapsed: (collapsed) => set({ isDashboardCollapsed: collapsed }),
      setSidebarPosition: (position) => set({ sidebarPosition: position }),
      setThemeVariant: (variant) => set({ themeVariant: variant }),
      setShowQuickActions: (show) => set({ showQuickActions: show }),
      setUsedInspector: (used) => set({ usedInspector: used }),
      setEnableAnimations: (enable) => set({ enableAnimations: enable }),
      setLastVisitedSection: (section) => set({ lastVisitedSection: section }),
      
      addPinnedShortcut: (shortcut) => set((state) => ({
        pinnedShortcuts: [...state.pinnedShortcuts, shortcut]
      })),
      
      removePinnedShortcut: (shortcut) => set((state) => ({
        pinnedShortcuts: state.pinnedShortcuts.filter(s => s !== shortcut)
      })),
      
      setCustomToken: (key, value) => set((state) => ({
        customTokens: { ...state.customTokens, [key]: value }
      })),
      
      loadPreferences: () => {
        // This is called on component mount to initialize preferences
        // If there's API-based persistence, this would fetch from there
        console.log("Loading admin preferences...");
        
        // For now, we just use the persisted state from Zustand
      }
    }),
    {
      name: 'admin-preferences-storage',
      // Only persist these fields to localStorage
      partialize: (state) => ({
        isDashboardCollapsed: state.isDashboardCollapsed,
        sidebarPosition: state.sidebarPosition,
        themeVariant: state.themeVariant,
        showQuickActions: state.showQuickActions,
        lastVisitedSection: state.lastVisitedSection,
        pinnedShortcuts: state.pinnedShortcuts,
        customTokens: state.customTokens,
      })
    }
  )
);
