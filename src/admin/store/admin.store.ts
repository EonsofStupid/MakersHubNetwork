
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAdminPersistMiddleware } from "../middleware/persist.middleware";

export interface AdminState {
  // Session and initialization
  isEditMode: boolean;
  hasInitialized: boolean;
  preferencesChanged: boolean;
  
  // UI state
  sidebarExpanded: boolean;
  activeSection: string;
  
  // Shortcuts and customization
  adminTopNavShortcuts: string[];
  dashboardShortcuts: string[];
  
  // Actions
  setEditMode: (isEditMode: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setActiveSection: (section: string) => void;
  setTopNavShortcuts: (shortcuts: string[]) => void;
  setDashboardShortcuts: (shortcuts: string[]) => void;
  markPreferencesChanged: () => void;
  resetPreferencesChanged: () => void;
  initializeStore: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // Initial state
      isEditMode: false,
      hasInitialized: false,
      preferencesChanged: false,
      sidebarExpanded: true,
      activeSection: 'overview',
      adminTopNavShortcuts: ['users', 'builds', 'reviews'],
      dashboardShortcuts: ['users', 'content', 'data-maestro', 'settings'],
      
      // Actions
      setEditMode: (isEditMode) => set({ isEditMode }),
      setSidebarExpanded: (expanded) => set({ 
        sidebarExpanded: expanded,
        preferencesChanged: true 
      }),
      setActiveSection: (section) => set({ activeSection: section }),
      setTopNavShortcuts: (shortcuts) => set({ 
        adminTopNavShortcuts: shortcuts,
        preferencesChanged: true 
      }),
      setDashboardShortcuts: (shortcuts) => set({ 
        dashboardShortcuts: shortcuts,
        preferencesChanged: true 
      }),
      markPreferencesChanged: () => set({ preferencesChanged: true }),
      resetPreferencesChanged: () => set({ preferencesChanged: false }),
      initializeStore: () => set({ hasInitialized: true }),
    }),
    createAdminPersistMiddleware<AdminState>('admin-store')
  )
);
