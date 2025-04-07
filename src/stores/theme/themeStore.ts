
import { create } from 'zustand';
import { getTheme } from '@/services/themeService';
import { Theme, ThemeContext, ComponentTokens, StoreThemeTokens } from '@/types/theme';
import { ThemeTokens, fallbackTokens } from '@/theme/schema';

export type ThemeLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

// Define the store state
export interface ThemeState {
  // Theme data
  currentTheme: Theme | null;
  tokens: StoreThemeTokens;
  themeComponents: ComponentTokens[];
  adminComponents: ComponentTokens[];
  loadStatus: ThemeLoadStatus;
  error: Error | null;
  
  // Loader functions
  loadTheme: (context?: ThemeContext) => Promise<void>;
  setTheme: (themeId: string) => Promise<void>;
  loadThemeComponents: () => Promise<void>;
  loadAdminComponents: () => Promise<void>;
  
  // Direct token update
  updateTokens: (tokens: Partial<StoreThemeTokens>) => void;
}

// Ensure we have fallbacks for all required token properties
const ensureAllTokens = (tokens: Partial<StoreThemeTokens>): StoreThemeTokens => {
  return {
    primary: tokens.primary || fallbackTokens.primary,
    secondary: tokens.secondary || fallbackTokens.secondary,
    accent: tokens.accent || fallbackTokens.accent,
    background: tokens.background || fallbackTokens.background,
    foreground: tokens.foreground || fallbackTokens.foreground,
    card: tokens.card || fallbackTokens.card,
    cardForeground: tokens.cardForeground || fallbackTokens.cardForeground,
    muted: tokens.muted || fallbackTokens.muted,
    mutedForeground: tokens.mutedForeground || fallbackTokens.mutedForeground,
    border: tokens.border || fallbackTokens.border,
    input: tokens.input || fallbackTokens.input,
    ring: tokens.ring || fallbackTokens.ring,
    effectPrimary: tokens.effectPrimary || fallbackTokens.effectPrimary,
    effectSecondary: tokens.effectSecondary || fallbackTokens.effectSecondary,
    effectTertiary: tokens.effectTertiary || fallbackTokens.effectTertiary,
    transitionFast: tokens.transitionFast || fallbackTokens.transitionFast,
    transitionNormal: tokens.transitionNormal || fallbackTokens.transitionNormal,
    transitionSlow: tokens.transitionSlow || fallbackTokens.transitionSlow,
    radiusSm: tokens.radiusSm || fallbackTokens.radiusSm,
    radiusMd: tokens.radiusMd || fallbackTokens.radiusMd,
    radiusLg: tokens.radiusLg || fallbackTokens.radiusLg,
    radiusFull: tokens.radiusFull || fallbackTokens.radiusFull,
    ...tokens // Keep any additional tokens
  };
};

// Create the store
export const useThemeStore = create<ThemeState>((set, get) => ({
  // Initial state
  currentTheme: null,
  tokens: ensureAllTokens({}), // Initialize with fallbacks
  themeComponents: [],
  adminComponents: [],
  loadStatus: 'idle',
  error: null,
  
  // Load theme from API
  loadTheme: async (context: ThemeContext = 'site') => {
    try {
      set({ loadStatus: 'loading' });
      
      const { theme, isFallback } = await getTheme({ 
        isDefault: true,
        context 
      });
      
      // Extract tokens from the theme
      const extractedTokens = extractTokensFromTheme(theme);
      
      set({ 
        currentTheme: theme,
        tokens: ensureAllTokens(extractedTokens),
        loadStatus: 'loaded'
      });
    } catch (error) {
      console.error('Failed to load theme:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Failed to load theme'),
        loadStatus: 'error',
        tokens: ensureAllTokens({}) // Use fallbacks
      });
    }
  },
  
  // Set theme by ID
  setTheme: async (themeId: string) => {
    try {
      set({ loadStatus: 'loading' });
      
      const { theme, isFallback } = await getTheme({ id: themeId });
      
      // Extract tokens from the theme
      const extractedTokens = extractTokensFromTheme(theme);
      
      set({ 
        currentTheme: theme,
        tokens: ensureAllTokens(extractedTokens),
        loadStatus: 'loaded'
      });
    } catch (error) {
      console.error('Failed to set theme:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Failed to set theme'),
        loadStatus: 'error'
      });
    }
  },
  
  // Load theme components
  loadThemeComponents: async () => {
    const { currentTheme } = get();
    
    if (!currentTheme) {
      return;
    }
    
    try {
      // Extract components from the current theme
      const components = currentTheme.component_tokens || [];
      set({ themeComponents: components });
    } catch (error) {
      console.error('Failed to load theme components:', error);
    }
  },
  
  // Load admin components
  loadAdminComponents: async () => {
    const { currentTheme } = get();
    
    if (!currentTheme) {
      return;
    }
    
    try {
      // Extract admin components from the current theme
      const components = (currentTheme.component_tokens || [])
        .filter(component => component.context === 'admin');
      
      set({ adminComponents: components });
    } catch (error) {
      console.error('Failed to load admin components:', error);
    }
  },
  
  // Update tokens directly
  updateTokens: (newTokens) => {
    set(state => ({
      tokens: ensureAllTokens({ ...state.tokens, ...newTokens })
    }));
  }
}));

// Helper function to extract tokens from theme
function extractTokensFromTheme(theme: Theme): Partial<StoreThemeTokens> {
  try {
    if (!theme || !theme.design_tokens) {
      return {};
    }

    const colors = theme.design_tokens.colors || {};
    const effects = theme.design_tokens.effects || { shadows: {}, blurs: {}, gradients: {} };
    const animation = theme.design_tokens.animation || {};
    const spacing = theme.design_tokens.spacing || {};
    
    return {
      // Colors with fallbacks
      primary: colors.primary || fallbackTokens.primary,
      secondary: colors.secondary || fallbackTokens.secondary,
      accent: colors.accent || fallbackTokens.accent,
      background: colors.background || fallbackTokens.background,
      foreground: colors.foreground || fallbackTokens.foreground,
      card: colors.card || fallbackTokens.card,
      cardForeground: colors.cardForeground || fallbackTokens.cardForeground,
      muted: colors.muted || fallbackTokens.muted,
      mutedForeground: colors.mutedForeground || fallbackTokens.mutedForeground,
      border: colors.border || fallbackTokens.border,
      input: colors.input || fallbackTokens.input,
      ring: colors.ring || fallbackTokens.ring,
      
      // Effect colors
      effectPrimary: effects.primary || fallbackTokens.effectPrimary,
      effectSecondary: effects.secondary || fallbackTokens.effectSecondary,
      effectTertiary: effects.tertiary || fallbackTokens.effectTertiary,
      
      // Animation timings
      transitionFast: animation.durations?.fast as string || fallbackTokens.transitionFast,
      transitionNormal: animation.durations?.normal as string || fallbackTokens.transitionNormal,
      transitionSlow: animation.durations?.slow as string || fallbackTokens.transitionSlow,
      
      // Radius values
      radiusSm: (spacing.radius?.sm as string) || fallbackTokens.radiusSm,
      radiusMd: (spacing.radius?.md as string) || fallbackTokens.radiusMd,
      radiusLg: (spacing.radius?.lg as string) || fallbackTokens.radiusLg,
      radiusFull: (spacing.radius?.full as string) || fallbackTokens.radiusFull,
    };
  } catch (error) {
    console.error('Error extracting tokens from theme:', error);
    return {};
  }
}

// Create selector hooks for convenience
export const useThemeTokens = () => useThemeStore(state => state.tokens);
export const useThemeComponents = () => useThemeStore(state => state.themeComponents);
export const useAdminComponents = () => useThemeStore(state => state.adminComponents);
export const useThemeStatus = () => useThemeStore(state => state.loadStatus);
export const useThemeError = () => useThemeStore(state => state.error);
