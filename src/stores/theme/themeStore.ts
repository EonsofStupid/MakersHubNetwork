
import { create } from 'zustand';
import { getTheme } from '@/services/themeService'; 
import { Theme, ThemeContext, ComponentTokens } from '@/types/theme';
import { ThemeTokens, fallbackTokens } from '@/theme/schema';

export type ThemeLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

// Define the store state
export interface ThemeState {
  // Theme data
  currentTheme: Theme | null;
  tokens: ThemeTokens;
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
  updateTokens: (tokens: Partial<ThemeTokens>) => void;
}

// Create the store
export const useThemeStore = create<ThemeState>((set, get) => ({
  // Initial state
  currentTheme: null,
  tokens: { ...fallbackTokens },
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
        tokens: { ...fallbackTokens, ...extractedTokens },
        loadStatus: 'loaded'
      });
      
      return theme;
    } catch (error) {
      console.error('Failed to load theme:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Failed to load theme'),
        loadStatus: 'error',
        tokens: { ...fallbackTokens }
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
        tokens: { ...fallbackTokens, ...extractedTokens },
        loadStatus: 'loaded'
      });
      
      return theme;
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
      tokens: { ...state.tokens, ...newTokens }
    }));
  }
}));

// Helper function to extract tokens from theme
function extractTokensFromTheme(theme: Theme): Partial<ThemeTokens> {
  try {
    return {
      // Extract colors from design_tokens
      primary: theme.design_tokens?.colors?.primary as string || fallbackTokens.primary,
      secondary: theme.design_tokens?.colors?.secondary as string || fallbackTokens.secondary,
      accent: theme.design_tokens?.colors?.accent as string || fallbackTokens.accent,
      background: theme.design_tokens?.colors?.background as string || fallbackTokens.background,
      foreground: theme.design_tokens?.colors?.foreground as string || fallbackTokens.foreground,
      card: theme.design_tokens?.colors?.card as string || fallbackTokens.card,
      cardForeground: theme.design_tokens?.colors?.cardForeground as string || fallbackTokens.cardForeground,
      muted: theme.design_tokens?.colors?.muted as string || fallbackTokens.muted,
      mutedForeground: theme.design_tokens?.colors?.mutedForeground as string || fallbackTokens.mutedForeground,
      border: theme.design_tokens?.colors?.border as string || fallbackTokens.border,
      input: theme.design_tokens?.colors?.input as string || fallbackTokens.input,
      ring: theme.design_tokens?.colors?.ring as string || fallbackTokens.ring,
      
      // Extract effect colors
      effectPrimary: theme.design_tokens?.effects?.primary as string || fallbackTokens.effectPrimary,
      effectSecondary: theme.design_tokens?.effects?.secondary as string || fallbackTokens.effectSecondary,
      effectTertiary: theme.design_tokens?.effects?.tertiary as string || fallbackTokens.effectTertiary,
      
      // Extract animation timings
      transitionFast: theme.design_tokens?.animation?.durations?.fast as string || fallbackTokens.transitionFast,
      transitionNormal: theme.design_tokens?.animation?.durations?.normal as string || fallbackTokens.transitionNormal,
      transitionSlow: theme.design_tokens?.animation?.durations?.slow as string || fallbackTokens.transitionSlow,
      
      // Extract radius values
      radiusSm: theme.design_tokens?.spacing?.radius?.sm as string || fallbackTokens.radiusSm,
      radiusMd: theme.design_tokens?.spacing?.radius?.md as string || fallbackTokens.radiusMd,
      radiusLg: theme.design_tokens?.spacing?.radius?.lg as string || fallbackTokens.radiusLg,
      radiusFull: theme.design_tokens?.spacing?.radius?.full as string || fallbackTokens.radiusFull,
    };
  } catch (error) {
    console.error('Error extracting tokens from theme:', error);
    return { ...fallbackTokens };
  }
}

// Create selector hooks for convenience
export const useThemeTokens = () => useThemeStore(state => state.tokens);
export const useThemeComponents = () => useThemeStore(state => state.themeComponents);
export const useAdminComponents = () => useThemeStore(state => state.adminComponents);
export const useThemeStatus = () => useThemeStore(state => state.loadStatus);
export const useThemeError = () => useThemeStore(state => state.error);
