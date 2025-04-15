
import { create } from 'zustand';
import { Theme, ThemeState, ThemeStatus, ThemeContext, ColorTokens, ShadowTokens, DesignTokens, ComponentTokens } from '@/shared/types';
import { generateColorMappings } from '../../utils/themeUtils';

// Default colors
const defaultColors: ColorTokens = {
  primary: '#0066cc',
  secondary: '#6c757d',
  accent: '#3d5afe',
  background: '#ffffff',
  foreground: '#1a1a1a',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  card: '#ffffff',
  cardForeground: '#1a1a1a',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#e2e8f0',
  input: '#e2e8f0',
  ring: '#0066cc',
  popover: '#ffffff',
  'popover-foreground': '#1a1a1a',
  'card-foreground': '#1a1a1a',
  'muted-foreground': '#64748b'
};

// Dark mode colors
const darkColors: ColorTokens = {
  primary: '#3b82f6',
  secondary: '#6c757d',
  accent: '#818cf8',
  background: '#0a0a0a',
  foreground: '#e5e5e5',
  muted: '#1e1e1e',
  mutedForeground: '#a1a1aa',
  card: '#1a1a1a',
  cardForeground: '#e5e5e5',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#272727',
  input: '#272727',
  ring: '#3b82f6',
  popover: '#171717',
  'popover-foreground': '#e5e5e5',
  'card-foreground': '#e5e5e5',
  'muted-foreground': '#a1a1aa'
};

// Default shadows
const defaultShadows: ShadowTokens = {
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// Default component tokens
const defaultComponentTokens: ComponentTokens = {
  button: {
    backgroundColor: 'hsl(var(--primary))',
    textColor: 'hsl(var(--primary-foreground))',
    hoverBackgroundColor: 'hsl(var(--primary)/0.9)',
    borderRadius: 'var(--radius-md)',
    paddingX: '1rem',
    paddingY: '0.5rem',
    fontWeight: '500',
    outlineColor: 'hsl(var(--ring))'
  },
  card: {
    backgroundColor: 'hsl(var(--card))',
    textColor: 'hsl(var(--card-foreground))',
    borderColor: 'hsl(var(--border))',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 'var(--radius-md)'
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: 'hsl(var(--input))',
    textColor: 'hsl(var(--foreground))',
    borderRadius: 'var(--radius-md)',
    placeholderColor: 'hsl(var(--muted-foreground))',
    focusBorderColor: 'hsl(var(--ring))',
    paddingX: '0.75rem',
    paddingY: '0.5rem'
  }
};

// Default design tokens
const defaultDesignTokens: DesignTokens = {
  colors: defaultColors,
  shadows: defaultShadows,
  radii: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2'
    }
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem'
  },
  transitions: {
    default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  animations: {
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite'
  },
  zIndices: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto'
  }
};

// Default theme
const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  label: 'Default',
  description: 'Default application theme',
  isDark: false,
  status: ThemeStatus.ACTIVE,
  context: ThemeContext.SITE,
  variables: {
    background: defaultColors.background,
    foreground: defaultColors.foreground,
    card: defaultColors.card,
    cardForeground: defaultColors.cardForeground,
    primary: defaultColors.primary,
    primaryForeground: '#ffffff',
    secondary: defaultColors.secondary,
    secondaryForeground: '#ffffff',
    muted: defaultColors.muted,
    mutedForeground: defaultColors.mutedForeground,
    accent: defaultColors.accent,
    accentForeground: '#ffffff',
    destructive: defaultColors.destructive,
    destructiveForeground: defaultColors.destructiveForeground,
    border: defaultColors.border,
    input: defaultColors.input,
    ring: defaultColors.ring,
    effectColor: defaultColors.primary,
    effectSecondary: defaultColors.accent,
    effectTertiary: defaultColors.secondary,
    transitionFast: '100ms',
    transitionNormal: '200ms',
    transitionSlow: '400ms',
    animationFast: '0.5s',
    animationNormal: '1s',
    animationSlow: '2s',
    radiusSm: '0.125rem',
    radiusMd: '0.25rem',
    radiusLg: '0.5rem',
    radiusFull: '9999px'
  },
  designTokens: defaultDesignTokens,
  componentTokens: defaultComponentTokens
};

// Initial state
const initialState: ThemeState = {
  themes: [defaultTheme],
  activeThemeId: defaultTheme.id,
  isDark: false,
  primaryColor: defaultColors.primary,
  backgroundColor: defaultColors.background,
  textColor: defaultColors.foreground,
  designTokens: defaultDesignTokens,
  componentTokens: defaultComponentTokens,
  isLoading: false,
  error: null
};

// Theme store actions interface
interface ThemeStoreActions {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetTheme: () => void;
  loadThemes: () => Promise<void>;
}

// Create the store
const useThemeStore = create<ThemeState & ThemeStoreActions>((set, get) => ({
  ...initialState,

  setThemes: (themes) => {
    set({ themes });
  },

  setActiveTheme: (themeId) => {
    const activeTheme = get().themes.find((theme) => theme.id === themeId);
    
    if (activeTheme) {
      set({
        activeThemeId: themeId,
        isDark: activeTheme.isDark,
        primaryColor: activeTheme.variables.primary,
        backgroundColor: activeTheme.variables.background,
        textColor: activeTheme.variables.foreground,
        designTokens: activeTheme.designTokens,
        componentTokens: activeTheme.componentTokens
      });
    }
  },

  setDesignTokens: (tokens) => {
    set((state) => ({
      designTokens: tokens,
      themes: state.themes.map((theme) =>
        theme.id === state.activeThemeId
          ? { ...theme, designTokens: tokens }
          : theme
      )
    }));
  },

  setComponentTokens: (tokens) => {
    set((state) => ({
      componentTokens: tokens,
      themes: state.themes.map((theme) =>
        theme.id === state.activeThemeId
          ? { ...theme, componentTokens: tokens }
          : theme
      )
    }));
  },

  setIsLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  resetTheme: () => {
    set({
      ...initialState
    });
  },

  loadThemes: async () => {
    try {
      set({ isLoading: true });
      
      // Mock API call or load from database in a real app
      // For now, just return the default themes after a small delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Cyberpunk theme
      const cyberpunkTheme: Theme = {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        label: 'Cyberpunk',
        description: 'A futuristic, neon-lit cyberpunk theme',
        isDark: true,
        status: ThemeStatus.ACTIVE,
        context: ThemeContext.SITE,
        variables: {
          background: '#0D0E18',
          foreground: '#E4F2FB',
          card: '#1A1B2E',
          cardForeground: '#E4F2FB',
          primary: '#0CF7E9',
          primaryForeground: '#0D0E18',
          secondary: '#F769E1',
          secondaryForeground: '#0D0E18',
          muted: '#2C2E47',
          mutedForeground: '#959CBD',
          accent: '#FF7EDB',
          accentForeground: '#0D0E18',
          destructive: '#FF003C',
          destructiveForeground: '#E4F2FB',
          border: '#2C2E47',
          input: '#2C2E47',
          ring: '#0CF7E9',
          effectColor: '#0CF7E9',
          effectSecondary: '#F769E1',
          effectTertiary: '#FF7EDB',
          transitionFast: '100ms',
          transitionNormal: '200ms',
          transitionSlow: '400ms',
          animationFast: '0.5s',
          animationNormal: '1s',
          animationSlow: '2s',
          radiusSm: '0.125rem',
          radiusMd: '0.25rem',
          radiusLg: '0.5rem',
          radiusFull: '9999px'
        },
        designTokens: {
          ...defaultDesignTokens,
          colors: {
            primary: '#0CF7E9',
            secondary: '#F769E1',
            accent: '#FF7EDB',
            background: '#0D0E18',
            foreground: '#E4F2FB',
            muted: '#2C2E47',
            mutedForeground: '#959CBD',
            card: '#1A1B2E',
            cardForeground: '#E4F2FB',
            destructive: '#FF003C',
            destructiveForeground: '#E4F2FB',
            border: '#2C2E47',
            input: '#2C2E47',
            ring: '#0CF7E9',
            popover: '#1A1B2E',
            'popover-foreground': '#E4F2FB',
            'card-foreground': '#E4F2FB',
            'muted-foreground': '#959CBD'
          },
          shadows: {
            inner: 'inset 0 2px 4px 0 rgba(12, 247, 233, 0.05)',
            sm: '0 1px 2px 0 rgba(12, 247, 233, 0.1)',
            md: '0 4px 6px -1px rgba(12, 247, 233, 0.15), 0 2px 4px -1px rgba(12, 247, 233, 0.06)',
            lg: '0 10px 15px -3px rgba(12, 247, 233, 0.2), 0 4px 6px -2px rgba(12, 247, 233, 0.15)',
            xl: '0 20px 25px -5px rgba(12, 247, 233, 0.25), 0 10px 10px -5px rgba(12, 247, 233, 0.2)'
          }
        },
        componentTokens: generateColorMappings({
          button: {
            backgroundColor: '#0CF7E9',
            textColor: '#0D0E18',
            hoverBackgroundColor: '#0be0d3',
            borderRadius: '0.25rem',
            paddingX: '1rem',
            paddingY: '0.5rem',
            fontWeight: '500',
            outlineColor: '#0CF7E9'
          },
          card: {
            backgroundColor: '#1A1B2E',
            textColor: '#E4F2FB',
            borderColor: '#2C2E47',
            shadowColor: 'rgba(12, 247, 233, 0.1)',
            borderRadius: '0.25rem'
          },
          input: {
            backgroundColor: 'transparent',
            borderColor: '#2C2E47',
            textColor: '#E4F2FB',
            borderRadius: '0.25rem',
            placeholderColor: '#959CBD',
            focusBorderColor: '#0CF7E9',
            paddingX: '0.75rem',
            paddingY: '0.5rem'
          }
        })
      };
      
      // Set themes
      set({
        themes: [defaultTheme, cyberpunkTheme],
        isLoading: false
      });
      
      // Set active theme
      get().setActiveTheme('cyberpunk');
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load themes',
        isLoading: false
      });
    }
  },
}));

export { useThemeStore };
