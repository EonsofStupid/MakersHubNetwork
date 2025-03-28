
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
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        preferences: state.preferences,
        features: state.features,
      }),
    }
  )
);
