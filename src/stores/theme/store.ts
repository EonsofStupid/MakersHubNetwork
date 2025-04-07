
import { create } from 'zustand';
import { getTheme } from '@/services/themeService';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { errorToObject } from '@/shared/rendering';
import { defaultTokens } from '@/theme/tokenSchema';
import { ThemeTokensSchema } from '@/theme/tokenSchema';
import { removeUndefineds } from '@/utils/themeTokenUtils';

// Define valid load status values
export type ThemeLoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface ThemeState {
  currentTheme: any | null;
  isLoading: boolean;
  error: Error | null;
  loadStatus: ThemeLoadStatus;
  tokens: ThemeTokensSchema;
  loadTheme: (themeId?: string) => Promise<void>;
  setTheme: (themeId: string) => Promise<void>;
  adminComponents: any[];
  loadAdminComponents: () => Promise<void>;
  themeTokens: ThemeTokensSchema;
}

const initialThemeState: Omit<ThemeState, 'loadTheme' | 'setTheme' | 'loadAdminComponents'> = {
  currentTheme: null,
  isLoading: false,
  error: null,
  loadStatus: 'idle' as ThemeLoadStatus,
  tokens: { ...defaultTokens },
  adminComponents: [],
  themeTokens: { ...defaultTokens },
};

export type ThemeStore = ThemeState;

export const useThemeStore = create<ThemeStore>((set, get) => ({
  ...initialThemeState,

  loadTheme: async (themeId?: string) => {
    try {
      set({
        isLoading: true,
        loadStatus: 'loading',
        error: null
      });

      const { theme, isFallback } = await getTheme({ id: themeId });

      if (theme) {
        // Extract colors safely, ensuring they're all defined
        const safeColors = theme.design_tokens?.colors || {};
        const safeEffects = theme.design_tokens?.effects || { primary: '', secondary: '', tertiary: '' };
        
        // Create a safe token object with fallbacks
        const safeTokens: Partial<ThemeTokensSchema> = {
          primary: safeColors.primary || defaultTokens.primary,
          secondary: safeColors.secondary || defaultTokens.secondary,
          accent: safeColors.accent || defaultTokens.accent,
          background: safeColors.background || defaultTokens.background,
          foreground: safeColors.foreground || defaultTokens.foreground,
          card: safeColors.card || defaultTokens.card,
          cardForeground: safeColors.cardForeground || defaultTokens.cardForeground,
          muted: safeColors.muted || defaultTokens.muted,
          mutedForeground: safeColors.mutedForeground || defaultTokens.mutedForeground,
          border: safeColors.border || defaultTokens.border,
          input: safeColors.input || defaultTokens.input,
          ring: safeColors.ring || defaultTokens.ring,
          effectPrimary: safeEffects.primary || defaultTokens.effectPrimary,
          effectSecondary: safeEffects.secondary || defaultTokens.effectSecondary,
          effectTertiary: safeEffects.tertiary || defaultTokens.effectTertiary,
          transitionFast: defaultTokens.transitionFast,
          transitionNormal: defaultTokens.transitionNormal,
          transitionSlow: defaultTokens.transitionSlow,
          radiusSm: defaultTokens.radiusSm,
          radiusMd: defaultTokens.radiusMd,
          radiusLg: defaultTokens.radiusLg,
          radiusFull: defaultTokens.radiusFull,
        };
        
        // Clean up any undefined values and merge with defaults
        const cleanTokens = {
          ...defaultTokens,
          ...removeUndefineds(safeTokens)
        };

        set({
          currentTheme: theme,
          tokens: cleanTokens,
          themeTokens: cleanTokens,
          isLoading: false,
          loadStatus: 'success',
          error: null
        });

        getLogger().info(`Theme loaded successfully: ${theme.name} (fallback: ${isFallback})`, {
          category: LogCategory.THEME,
          details: {
            themeId: theme.id,
            isFallback,
            componentTokensCount: Array.isArray(theme.component_tokens) ? theme.component_tokens.length : 0
          }
        });
      } else {
        const errorMessage = 'Failed to load theme: Theme not found';
        getLogger().error(errorMessage, {
          category: LogCategory.THEME,
          details: { themeId }
        });

        set({
          isLoading: false,
          loadStatus: 'error' as ThemeLoadStatus,
          error: new Error(errorMessage),
          // Always use default tokens when there's an error
          tokens: { ...defaultTokens },
          themeTokens: { ...defaultTokens }
        });
      }
    } catch (error) {
      const errorObj = errorToObject(error);
      getLogger().error('Error loading theme', {
        category: LogCategory.THEME,
        details: errorObj
      });

      set({
        isLoading: false,
        loadStatus: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
        // Always use default tokens when there's an error
        tokens: { ...defaultTokens },
        themeTokens: { ...defaultTokens }
      });
    }
  },

  setTheme: async (themeId: string) => {
    try {
      set({
        isLoading: true,
        loadStatus: 'loading',
        error: null
      });

      const { theme, isFallback } = await getTheme({ id: themeId });

      if (theme) {
        // Extract colors safely, ensuring they're all defined
        const safeColors = theme.design_tokens?.colors || {};
        const safeEffects = theme.design_tokens?.effects || { primary: '', secondary: '', tertiary: '' };
        
        // Create a safe token object with fallbacks
        const safeTokens: Partial<ThemeTokensSchema> = {
          primary: safeColors.primary || defaultTokens.primary,
          secondary: safeColors.secondary || defaultTokens.secondary,
          accent: safeColors.accent || defaultTokens.accent,
          background: safeColors.background || defaultTokens.background,
          foreground: safeColors.foreground || defaultTokens.foreground,
          card: safeColors.card || defaultTokens.card,
          cardForeground: safeColors.cardForeground || defaultTokens.cardForeground,
          muted: safeColors.muted || defaultTokens.muted,
          mutedForeground: safeColors.mutedForeground || defaultTokens.mutedForeground,
          border: safeColors.border || defaultTokens.border,
          input: safeColors.input || defaultTokens.input,
          ring: safeColors.ring || defaultTokens.ring,
          effectPrimary: safeEffects.primary || defaultTokens.effectPrimary,
          effectSecondary: safeEffects.secondary || defaultTokens.effectSecondary,
          effectTertiary: safeEffects.tertiary || defaultTokens.effectTertiary,
          transitionFast: defaultTokens.transitionFast,
          transitionNormal: defaultTokens.transitionNormal,
          transitionSlow: defaultTokens.transitionSlow,
          radiusSm: defaultTokens.radiusSm,
          radiusMd: defaultTokens.radiusMd,
          radiusLg: defaultTokens.radiusLg,
          radiusFull: defaultTokens.radiusFull,
        };
        
        // Clean up any undefined values and merge with defaults
        const cleanTokens = {
          ...defaultTokens,
          ...removeUndefineds(safeTokens)
        };

        set({
          currentTheme: theme,
          tokens: cleanTokens,
          themeTokens: cleanTokens,
          isLoading: false,
          loadStatus: 'success',
          error: null
        });

        getLogger().info(`Theme set successfully: ${theme.name}`, {
          category: LogCategory.THEME,
          details: {
            themeId: theme.id,
            isFallback
          }
        });
      } else {
        const errorMessage = 'Failed to set theme: Theme not found';
        getLogger().error(errorMessage, {
          category: LogCategory.THEME,
          details: { themeId }
        });

        set({
          isLoading: false,
          loadStatus: 'error',
          error: new Error(errorMessage),
          // Always use default tokens when there's an error
          tokens: { ...defaultTokens },
          themeTokens: { ...defaultTokens }
        });
      }
    } catch (error) {
      const errorObj = errorToObject(error);
      getLogger().error('Error setting theme', {
        category: LogCategory.THEME,
        details: errorObj
      });

      set({
        isLoading: false,
        loadStatus: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
        // Always use default tokens when there's an error
        tokens: { ...defaultTokens },
        themeTokens: { ...defaultTokens }
      });
    }
  },

  loadAdminComponents: async () => {
    const { currentTheme } = get();
    
    if (!currentTheme) {
      set({ adminComponents: [] });
      return;
    }
    
    try {
      // Extract admin components from the current theme
      const components = (currentTheme.component_tokens || [])
        .filter(component => component.context === 'admin');
      
      set({ adminComponents: components });
    } catch (error) {
      console.error('Failed to load admin components:', error);
      set({ adminComponents: [] });
    }
  },
}));
