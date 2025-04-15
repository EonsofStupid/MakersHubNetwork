
import { create } from 'zustand';
import { Theme, ThemeState, ThemeStoreActions } from '@/shared/types/theme/state.types';
import { DesignTokens, ComponentTokens } from '@/shared/types/theme/tokens.types';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  description: 'Default system theme',
  isDark: false,
  status: 'active',
  context: 'site',
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
    accentForeground: '#000000',
    destructive: '#ff0000',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#0070f3'
  },
  designTokens: {
    colors: {
      primary: '#0070f3',
      background: '#ffffff'
    }
  },
  componentTokens: {}
};

export const useThemeStore = create<ThemeState & ThemeStoreActions>((set) => ({
  themes: [defaultTheme],
  activeThemeId: defaultTheme.id,
  isDark: false,
  primaryColor: defaultTheme.variables.primary,
  backgroundColor: defaultTheme.variables.background,
  textColor: defaultTheme.variables.foreground,
  designTokens: defaultTheme.designTokens,
  componentTokens: defaultTheme.componentTokens || {},
  isLoading: false,
  error: null,
  variables: defaultTheme.variables,
  theme: defaultTheme,
  isLoaded: true,
  animations: {},

  // Actions
  setThemes: (themes) => {
    set({ themes });
    logger.log(LogLevel.INFO, LogCategory.THEME, 'Themes updated');
  },

  setActiveTheme: (themeId) => {
    set((state) => {
      const theme = state.themes.find(t => t.id === themeId);
      if (!theme) return state;

      return {
        activeThemeId: themeId,
        isDark: theme.isDark || false,
        primaryColor: theme.variables.primary,
        backgroundColor: theme.variables.background,
        textColor: theme.variables.foreground,
        theme,
        variables: theme.variables,
        designTokens: theme.designTokens,
        componentTokens: theme.componentTokens || {}
      };
    });
  },

  setDesignTokens: (tokens: DesignTokens) => {
    set({ designTokens: tokens });
  },

  setComponentTokens: (tokens: ComponentTokens) => {
    set({ componentTokens: tokens });
  },

  // Required actions implementation
  fetchThemes: async () => {
    set({ isLoading: true });
    try {
      // For now just set default theme
      set({ 
        themes: [defaultTheme],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch themes',
        isLoading: false 
      });
    }
  },

  createTheme: async (theme) => {
    set((state) => ({ themes: [...state.themes, theme] }));
  },

  updateTheme: async (theme) => {
    set((state) => ({
      themes: state.themes.map((t) => (t.id === theme.id ? theme : t))
    }));
  },

  deleteTheme: async (themeId) => {
    set((state) => ({
      themes: state.themes.filter((t) => t.id !== themeId)
    }));
  },

  resetTheme: () => {
    set({
      themes: [defaultTheme],
      activeThemeId: defaultTheme.id,
      isDark: false,
      primaryColor: defaultTheme.variables.primary,
      backgroundColor: defaultTheme.variables.background,
      textColor: defaultTheme.variables.foreground,
      theme: defaultTheme,
      variables: defaultTheme.variables,
      designTokens: defaultTheme.designTokens,
      componentTokens: defaultTheme.componentTokens,
      isLoaded: true
    });
  }
}));
