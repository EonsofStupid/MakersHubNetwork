
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UIStore, UIState } from './types';

const initialState: UIState = {
  theme: {
    mode: 'dark',
    accentColor: '#00F0FF',
  },
  layout: {
    isNavOpen: false,
    contentWidth: 'default',
  },
  preferences: {
    reducedMotion: false,
    highContrast: false,
  },
  features: {
    showcasedBuilds: 4,
    animationsEnabled: true,
    extendedInfo: false,
  },
  admin: {
    sidebarExpanded: true,
    activeSection: 'overview',
    overlayVisible: false,
    inspectorEnabled: false,
  }
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Theme actions
      setThemeMode: (mode) => 
        set((state) => ({
          theme: { ...state.theme, mode }
        })),
      
      setAccentColor: (color) =>
        set((state) => ({
          theme: { ...state.theme, accentColor: color }
        })),
      
      // Layout actions
      toggleNav: () =>
        set((state) => ({
          layout: { ...state.layout, isNavOpen: !state.layout.isNavOpen }
        })),
      
      setContentWidth: (width) =>
        set((state) => ({
          layout: { ...state.layout, contentWidth: width }
        })),
      
      // Preferences actions
      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value }
        })),
        
      // Feature actions
      setFeature: (key, value) =>
        set((state) => ({
          features: { ...state.features, [key]: value }
        })),
        
      setShowcasedBuildsCount: (count) =>
        set((state) => ({
          features: { ...state.features, showcasedBuilds: count }
        })),
        
      // Admin actions
      toggleAdminSidebar: () =>
        set((state) => ({
          admin: { ...state.admin, sidebarExpanded: !state.admin.sidebarExpanded }
        })),
        
      setAdminSidebar: (expanded) =>
        set((state) => ({
          admin: { ...state.admin, sidebarExpanded: expanded }
        })),
        
      setAdminActiveSection: (section) =>
        set((state) => ({
          admin: { ...state.admin, activeSection: section }
        })),
        
      toggleAdminOverlay: () =>
        set((state) => ({
          admin: { ...state.admin, overlayVisible: !state.admin.overlayVisible }
        })),
        
      setAdminInspectorEnabled: (enabled) =>
        set((state) => ({
          admin: { ...state.admin, inspectorEnabled: enabled }
        })),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        preferences: state.preferences,
        features: state.features,
        admin: state.admin,
      }),
    }
  )
);
