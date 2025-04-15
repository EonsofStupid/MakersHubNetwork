
import { create } from 'zustand';
import { Theme, ThemeState, ThemeStoreActions, DesignTokens, ComponentTokens } from '@/shared/types/theme/theme.types';
import { devtools, persist } from 'zustand/middleware';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

const initialState: ThemeState = {
  themes: [],
  activeThemeId: null,
  isDark: false,
  primaryColor: '#0070f3',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  designTokens: {
    colors: {},
  },
  componentTokens: {},
  isLoading: false,
  error: null,
  variables: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#ffffff',
    cardForeground: '#000000',
    primary: '#0070f3',
    primaryForeground: '#ffffff',
    secondary: '#7928ca',
    secondaryForeground: '#ffffff',
    muted: '#f5f5f5',
    mutedForeground: '#6b7280',
    accent: '#f5a623',
    accentForeground: '#ffffff',
    destructive: '#ff0000',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#0070f3',
  },
  theme: null,
  isLoaded: false,
};

export const useThemeStore = create<ThemeState & ThemeStoreActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setThemes: (themes) => set({ themes }),

        setActiveTheme: (themeId) => {
          set((state) => {
            const theme = state.themes.find((t) => t.id === themeId);
            if (!theme) return state;

            return {
              activeThemeId: themeId,
              isDark: theme.isDark || false,
              theme,
              variables: theme.variables,
              designTokens: theme.designTokens,
              componentTokens: theme.componentTokens || {},
              isLoaded: true,
            };
          });
        },

        setDesignTokens: (tokens: DesignTokens) => set({ designTokens: tokens }),
        
        setComponentTokens: (tokens: ComponentTokens) => set({ componentTokens: tokens }),

        fetchThemes: async () => {
          set({ isLoading: true });
          try {
            // Simulated API call - replace with actual implementation
            const themes: Theme[] = [];
            set({ themes, isLoading: false });
          } catch (error) {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        },

        createTheme: async (theme) => {
          set({ isLoading: true });
          try {
            set((state) => ({ 
              themes: [...state.themes, theme], 
              isLoading: false 
            }));
          } catch (error) {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        },

        updateTheme: async (theme) => {
          set({ isLoading: true });
          try {
            set((state) => ({
              themes: state.themes.map((t) => (t.id === theme.id ? theme : t)),
              isLoading: false,
            }));
          } catch (error) {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        },

        deleteTheme: async (themeId) => {
          set({ isLoading: true });
          try {
            set((state) => ({
              themes: state.themes.filter((t) => t.id !== themeId),
              isLoading: false,
            }));
          } catch (error) {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        },

        resetTheme: () => set(initialState),
      }),
      {
        name: 'theme-store',
        partialize: (state) => ({
          activeThemeId: state.activeThemeId,
          isDark: state.isDark,
        }),
      }
    )
  )
);
