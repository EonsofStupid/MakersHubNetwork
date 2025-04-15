
import { create } from 'zustand';
import { Theme, ThemeState, ComponentTokens, DesignTokens, ThemeStoreActions } from '@/shared/types';

// Utility functions
const getDefaultDesignTokens = (): DesignTokens => ({
  colors: {
    primary: '#0070f3',
    secondary: '#7928ca',
    accent: '#f5a623',
    background: '#ffffff',
    foreground: '#000000',
    muted: '#f5f5f5',
    mutedForeground: '#6b7280',
    card: '#ffffff',
    cardForeground: '#000000',
    destructive: '#ff0000',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#0070f3',
    popover: '#ffffff',
    'popover-foreground': '#000000',
    'card-foreground': '#000000',
    'muted-foreground': '#6b7280',
  },
  // Add other design tokens here
});

// Initial state
const initialState: ThemeState = {
  themes: [],
  activeThemeId: '',
  isDark: false,
  primaryColor: '#0070f3',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  designTokens: getDefaultDesignTokens(),
  componentTokens: {
    button: {},
    card: {},
    input: {},
    badge: {},
    alert: {},
  },
  isLoading: false,
  error: null,
  componentStyles: {},
  animations: {},
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
    effectColor: '#0070f3',
    effectSecondary: '#7928ca',
    effectTertiary: '#f5a623',
    transitionFast: '150ms',
    transitionNormal: '250ms',
    transitionSlow: '500ms',
    animationFast: '300ms',
    animationNormal: '500ms',
    animationSlow: '1000ms',
    radiusSm: '0.125rem',
    radiusMd: '0.25rem',
    radiusLg: '0.5rem',
    radiusFull: '9999px'
  },
  isLoaded: false
};

// Create the store
export const useThemeStore = create<ThemeState & ThemeStoreActions>((set, get) => ({
  ...initialState,

  setThemes: (themes) => {
    set({ themes });
  },

  setActiveTheme: (themeId) => {
    set({ activeThemeId: themeId });
    const activeTheme = get().themes.find(theme => theme.id === themeId);
    if (activeTheme) {
      set({
        isDark: activeTheme.isDark,
        primaryColor: activeTheme.designTokens.colors?.primary || '#0070f3',
        backgroundColor: activeTheme.designTokens.colors?.background || '#ffffff',
        textColor: activeTheme.designTokens.colors?.foreground || '#000000',
        theme: activeTheme,
        isLoaded: true,
        variables: activeTheme.variables,
        animations: activeTheme.designTokens.animations
      });
    }
  },

  setDesignTokens: (tokens) => {
    set((state) => {
      const activeTheme = state.themes.find(theme => theme.id === state.activeThemeId);
      if (activeTheme) {
        const updatedThemes = state.themes.map(theme => {
          if (theme.id === state.activeThemeId) {
            return { ...theme, designTokens: tokens };
          }
          return theme;
        });
        return { 
          themes: updatedThemes,
          designTokens: tokens
        };
      }
      return { 
        designTokens: tokens 
      };
    });
  },

  setComponentTokens: (tokens) => {
    set({ componentTokens: tokens });
  },

  setIsLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  loadTheme: async (themeId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate theme loading with timeout
      // In a real implementation, this would load from API/storage
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const themes = get().themes;
      const theme = themes.find(t => t.id === themeId);
      
      if (theme) {
        set({ 
          activeThemeId: theme.id,
          isDark: theme.isDark,
          primaryColor: theme.designTokens.colors?.primary || '#0070f3',
          backgroundColor: theme.designTokens.colors?.background || '#ffffff',
          textColor: theme.designTokens.colors?.foreground || '#000000',
          designTokens: theme.designTokens,
          componentTokens: theme.componentTokens,
          theme,
          variables: theme.variables,
          animations: theme.designTokens.animations,
          isLoaded: true,
          isLoading: false
        });
      } else {
        set({ 
          error: `Theme with ID ${themeId} not found`,
          isLoading: false
        });
      }
    } catch (error) {
      set({ 
        error: `Failed to load theme: ${error instanceof Error ? error.message : String(error)}`,
        isLoading: false
      });
    }
  }
}));

export default useThemeStore;
