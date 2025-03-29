
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUIState {
  // UI State
  sidebarExpanded: boolean;
  scrollY: number;
  activeSection: string;
  
  // UI functions
  setSidebar: (val: boolean) => void;
  toggleSidebar: () => void;
  setActiveSection: (section: string) => void;
  setScrollY: (val: number) => void;
}

export const useAdminUI = create<AdminUIState>()(
  persist(
    (set) => ({
      // Default UI state
      sidebarExpanded: true,
      scrollY: 0,
      activeSection: 'overview',
      
      // UI functions
      setSidebar: (val) => set({ sidebarExpanded: val }),
      toggleSidebar: () => set(state => ({ sidebarExpanded: !state.sidebarExpanded })),
      setActiveSection: (section) => set({ activeSection: section }),
      setScrollY: (val) => set({ scrollY: val }),
    }),
    {
      name: 'admin-ui-store',
      partialize: (state) => ({
        sidebarExpanded: state.sidebarExpanded,
        activeSection: state.activeSection,
      })
    }
  )
);
