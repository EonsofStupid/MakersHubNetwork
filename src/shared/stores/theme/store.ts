
import { create } from 'zustand';
import { 
  Theme, ThemeState, ComponentTokens, DesignTokens, 
  ColorTokens, SpacingTokens, TypographyTokens, 
  EffectTokens, RadiusTokens, ShadowTokens,
  LogLevel, LogCategory 
} from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

// Define initial component tokens to avoid type errors
const initialComponentTokens: ComponentTokens = {
  button: {},
  card: {},
  input: {},
  badge: {},
  alert: {}
};

// Initial design tokens to avoid type errors
const initialDesignTokens: DesignTokens = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#F97316',
    background: '#0F1729',
    foreground: '#F8FAFC',
    muted: '#334155',
    'muted-foreground': '#94A3B8',
    popover: '#1E293B',
    'popover-foreground': '#F8FAFC',
    card: '#1E293B',
    'card-foreground': '#F8FAFC', 
    border: '#334155',
    input: '#334155',
    ring: '#8B5CF6'
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '4rem'
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    }
  },
  effects: {
    blur: {
      sm: '4px',
      md: '8px',
      lg: '12px'
    },
    glow: {
      sm: '0 0 4px',
      md: '0 0 8px',
      lg: '0 0 16px'
    }
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
};

// Initial state
const initialState: ThemeState = {
  themes: [],
  activeThemeId: '',
  designTokens: initialDesignTokens,
  componentTokens: initialComponentTokens,
  isLoading: false,
  error: null,
  isLoaded: false,
  theme: undefined,
  variables: {},
  componentStyles: {},
  tokens: []
};

// Create the store
export const useThemeStore = create<ThemeState & {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  applyTheme: (themeId: string) => void;
  loadThemes: () => Promise<void>;
  resetTheme: () => void;
}>((set, get) => ({
  ...initialState,

  setThemes: (themes) => {
    set({ themes });
  },

  setActiveTheme: (themeId) => {
    set({ activeThemeId: themeId });
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
        themes: state.themes, 
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

  applyTheme: (themeId) => {
    set((state) => {
      const theme = state.themes.find(t => t.id === themeId);
      if (theme) {
        return {
          activeThemeId: themeId,
          designTokens: theme.designTokens,
          componentTokens: theme.componentTokens,
          theme: theme
        };
      }
      return state;
    });

    logger.log(LogLevel.INFO, LogCategory.SYSTEM, `Theme applied: ${themeId}`);
  },

  loadThemes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock theme loading for now
      // In a real app this would fetch from an API
      setTimeout(() => {
        const mockTheme: Theme = {
          id: 'impulsivity',
          name: 'Impulsivity',
          description: 'Default theme for the Makers IMPULSE system',
          version: 1,
          designTokens: initialDesignTokens,
          componentTokens: initialComponentTokens,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: '',
          published_at: '',
          parent_theme_id: ''
        };
        
        set({
          themes: [mockTheme],
          activeThemeId: mockTheme.id,
          designTokens: mockTheme.designTokens,
          componentTokens: mockTheme.componentTokens,
          isLoading: false,
          isLoaded: true,
          theme: mockTheme,
          variables: {
            '--primary': mockTheme.designTokens.colors.primary,
            '--secondary': mockTheme.designTokens.colors.secondary,
            '--accent': mockTheme.designTokens.colors.accent,
            '--background': mockTheme.designTokens.colors.background,
            '--foreground': mockTheme.designTokens.colors.foreground
          },
          componentStyles: {
            button: mockTheme.componentTokens.button,
            card: mockTheme.componentTokens.card,
            input: mockTheme.componentTokens.input,
            badge: mockTheme.componentTokens.badge,
            alert: mockTheme.componentTokens.alert
          }
        });
        
        logger.log(LogLevel.INFO, LogCategory.SYSTEM, 'Themes loaded', { count: 1 });
      }, 100);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load themes';
      logger.log(LogLevel.ERROR, LogCategory.SYSTEM, 'Failed to load themes', { error: errorMessage });
      set({ 
        isLoading: false,
        error: errorMessage
      });
    }
  },

  resetTheme: () => {
    set(initialState);
    logger.log(LogLevel.INFO, LogCategory.SYSTEM, 'Theme state reset');
  }
}));
