
import { create } from 'zustand';
import { Theme, ThemeState, ComponentTokens, DesignTokens, ThemeContext, ThemeStatus, ThemeEffect } from '@/shared/types/features/theme.types';

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  label: 'Default',
  description: 'Default theme',
  isDark: false,
  status: ThemeStatus.ACTIVE,
  context: ThemeContext.SITE,
  variables: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#f7f7f7',
    cardForeground: '#000000',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#f3f4f6',
    secondaryForeground: '#000000',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f59e0b',
    accentForeground: '#000000',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#3b82f6',
    effectColor: '#3b82f6',
    effectSecondary: '#f59e0b',
    effectTertiary: '#10b981',
    transitionFast: '150ms',
    transitionNormal: '300ms',
    transitionSlow: '500ms',
    animationFast: '300ms',
    animationNormal: '500ms',
    animationSlow: '1000ms',
    radiusSm: '0.125rem',
    radiusMd: '0.25rem',
    radiusLg: '0.5rem',
    radiusFull: '9999px'
  },
  designTokens: {
    colors: {
      primary: '#3b82f6',
      secondary: '#f3f4f6',
      background: '#ffffff',
      foreground: '#000000',
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      }
    }
  },
  componentTokens: {
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      fontWeight: '500',
    },
    card: {
      padding: '1rem',
      borderRadius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  themes: [defaultTheme],
  activeThemeId: defaultTheme.id,
  isDark: defaultTheme.isDark,
  primaryColor: defaultTheme.variables?.primary || '',
  backgroundColor: defaultTheme.variables?.background || '',
  textColor: defaultTheme.variables?.foreground || '',
  designTokens: defaultTheme.designTokens || {},
  componentTokens: defaultTheme.componentTokens || {},
  isLoading: false,
  error: null,
  theme: defaultTheme,
  isLoaded: true,
  variables: Object.entries(defaultTheme.variables || {}).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: String(value)
  }), {}),
  componentStyles: {},
  animations: {},
  effects: [],
  
  setThemes: (themes) => set({ themes }),
  
  setActiveTheme: (themeId) => set((state) => {
    const theme = state.themes?.find(t => t.id === themeId);
    if (!theme) return state;

    const variables = Object.entries(theme.variables || {}).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value)
    }), {});

    return {
      activeThemeId: themeId,
      isDark: theme.isDark || false,
      theme,
      designTokens: theme.designTokens || {},
      componentTokens: theme.componentTokens || {},
      primaryColor: theme.variables?.primary || '',
      backgroundColor: theme.variables?.background || '',
      textColor: theme.variables?.foreground || '',
      variables
    };
  }),
  
  setDesignTokens: (tokens) => set({ designTokens: tokens }),
  setComponentTokens: (tokens) => set({ componentTokens: tokens }),
  setEffects: (effects) => set({ effects }),
  setVariables: (vars) => set({ variables: vars })
}));
