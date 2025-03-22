
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminUIState = {
  sidebarExpanded: boolean;
  pinnedIcons: string[];
  scrollY: number;
  activeSection: string;
}

export type AdminUIActions = {
  setSidebar: (val: boolean) => void;
  pinIcon: (id: string) => void;
  unpinIcon: (id: string) => void;
  setScrollY: (val: number) => void;
  setActiveSection: (section: string) => void;
}

export type AdminUIStore = AdminUIState & AdminUIActions;

export const useAdminUI = create<AdminUIStore>()(
  persist(
    (set) => ({
      sidebarExpanded: true,
      pinnedIcons: [],
      scrollY: 0,
      activeSection: 'dashboard',
      
      setSidebar: (val) => set({ sidebarExpanded: val }),
      
      pinIcon: (id) => set((state) => ({
        pinnedIcons: state.pinnedIcons.includes(id) 
          ? state.pinnedIcons 
          : [...state.pinnedIcons, id]
      })),
      
      unpinIcon: (id) => set((state) => ({
        pinnedIcons: state.pinnedIcons.filter(iconId => iconId !== id)
      })),
      
      setScrollY: (val) => set({ scrollY: val }),
      
      setActiveSection: (section) => set({ activeSection: section })
    }),
    {
      name: 'admin-ui-storage',
      partialize: (state) => ({
        sidebarExpanded: state.sidebarExpanded,
        pinnedIcons: state.pinnedIcons,
        activeSection: state.activeSection
      })
    }
  )
);
