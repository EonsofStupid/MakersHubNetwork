import { create } from 'zustand';
import { getThemeWithFallback, loadThemeTokens, persistThemeTokens } from '@/lib/theme/themeLoader';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { errorToObject } from '@/shared/rendering';
import { ThemeTokensSchema } from '@/theme/tokenSchema';
import { z } from 'zod';
import { Theme, ThemeContext } from '@/types/theme';
import { ThemeContextSchema } from '@/types/themeContext';
import defaultTheme from '@/theme/defaultTheme';

// Define valid load status values using Zod for better type safety
export const ThemeLoadStatusSchema = z.enum(['idle', 'loading', 'success', 'error']);
export type ThemeLoadStatus = z.infer<typeof ThemeLoadStatusSchema>;

// Interface for theme service options with Zod validation
export const ThemeServiceOptionsSchema = z.object({
  id: z.string().optional(),
  context: ThemeContextSchema.optional(),
  name: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type ThemeServiceOptions = z.infer<typeof ThemeServiceOptionsSchema>;

interface ThemeState {
  currentTheme: Theme | null;
  isLoading: boolean;
  error: Error | null;
  loadStatus: ThemeLoadStatus;
  tokens: ThemeTokensSchema;
  loadTheme: (contextOrThemeId?: string) => Promise<void>;
  setTheme: (themeId: string) => Promise<void>;
  adminComponents: any[];
  loadAdminComponents: () => Promise<void>;
  themeTokens: ThemeTokensSchema;
}

const initialThemeState: Omit<ThemeState, 'loadTheme' | 'setTheme' | 'loadAdminComponents'> = {
  currentTheme: null,
  isLoading: false,
  error: null,
  loadStatus: ThemeLoadStatusSchema.enum.idle,
  tokens: { ...defaultTheme },
  adminComponents: [],
  themeTokens: { ...defaultTheme },
};

export type ThemeStore = ThemeState;

export const useThemeStore = create<ThemeStore>((set, get) => ({
  ...initialThemeState,

  loadTheme: async (contextOrThemeId?: string) => {
    try {
      set({
        isLoading: true,
        loadStatus: ThemeLoadStatusSchema.enum.loading,
        error: null
      });

      // Parse input as either themeId or context
      let options: ThemeServiceOptions = {};
      let context: ThemeContext = 'app';
      
      if (contextOrThemeId) {
        // Try to parse as ThemeContext first
        if (ThemeContextSchema.safeParse(contextOrThemeId).success) {
          context = contextOrThemeId as ThemeContext;
          options = { context };
          getLogger().info(`Loading theme for context: ${context}`);
        } else {
          // If not a valid context, treat as themeId
          options = { id: contextOrThemeId };
          getLogger().info(`Loading theme by ID: ${contextOrThemeId}`);
        }
      } else {
        // Default to 'app' context if no input provided
        options = { context: 'app' as ThemeContext };
        getLogger().info('Loading default app theme');
      }

      // Load theme with fallback chain
      const theme = await getThemeWithFallback(options);
      const tokens = await loadThemeTokens(context);
      
      // Persist tokens for offline use
      persistThemeTokens(tokens);

      set({
        currentTheme: theme,
        tokens,
        themeTokens: tokens,
        isLoading: false,
        loadStatus: ThemeLoadStatusSchema.enum.success,
        error: null
      });

      getLogger().info(`Theme loaded successfully: ${theme.name}`, {
        category: LogCategory.THEME,
        details: {
          themeId: theme.id,
          context: options.context,
          componentTokensCount: Array.isArray(theme.component_tokens) ? theme.component_tokens.length : 0
        }
      });
    } catch (error) {
      const errorObj = errorToObject(error);
      getLogger().error('Error loading theme', {
        category: LogCategory.THEME,
        details: errorObj
      });

      set({
        isLoading: false,
        loadStatus: ThemeLoadStatusSchema.enum.error,
        error: error instanceof Error ? error : new Error(String(error)),
        // Always use default tokens when there's an error
        tokens: { ...defaultTheme },
        themeTokens: { ...defaultTheme }
      });
    }
  },

  setTheme: async (themeId: string) => {
    try {
      set({
        isLoading: true,
        loadStatus: ThemeLoadStatusSchema.enum.loading,
        error: null
      });

      const { theme, isFallback } = await getTheme({ id: themeId });

      if (theme) {
        // Extract colors safely, ensuring they're all defined
        const safeColors = theme.design_tokens?.colors || {};
        const safeEffects = theme.design_tokens?.effects || { primary: '', secondary: '', tertiary: '' };
        
        // Create a safe token object with fallbacks
        const safeTokens: Partial<ThemeTokensSchema> = {
          primary: safeColors.primary || defaultTheme.primary,
          secondary: safeColors.secondary || defaultTheme.secondary,
          accent: safeColors.accent || defaultTheme.accent,
          background: safeColors.background || defaultTheme.background,
          foreground: safeColors.foreground || defaultTheme.foreground,
          card: safeColors.card || defaultTheme.card,
          cardForeground: safeColors.cardForeground || defaultTheme.cardForeground,
          muted: safeColors.muted || defaultTheme.muted,
          mutedForeground: safeColors.mutedForeground || defaultTheme.mutedForeground,
          border: safeColors.border || defaultTheme.border,
          input: safeColors.input || defaultTheme.input,
          ring: safeColors.ring || defaultTheme.ring,
          effectPrimary: safeEffects.primary || defaultTheme.effectPrimary,
          effectSecondary: safeEffects.secondary || defaultTheme.effectSecondary,
          effectTertiary: safeEffects.tertiary || defaultTheme.effectTertiary,
          transitionFast: defaultTheme.transitionFast,
          transitionNormal: defaultTheme.transitionNormal,
          transitionSlow: defaultTheme.transitionSlow,
          radiusSm: defaultTheme.radiusSm,
          radiusMd: defaultTheme.radiusMd,
          radiusLg: defaultTheme.radiusLg,
          radiusFull: defaultTheme.radiusFull,
        };
        
        // Clean up any undefined values and merge with defaults
        const cleanTokens = {
          ...defaultTheme,
          ...removeUndefineds(safeTokens)
        };

        set({
          currentTheme: theme,
          tokens: cleanTokens,
          themeTokens: cleanTokens,
          isLoading: false,
          loadStatus: ThemeLoadStatusSchema.enum.success,
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
          loadStatus: ThemeLoadStatusSchema.enum.error,
          error: new Error(errorMessage),
          // Always use default tokens when there's an error
          tokens: { ...defaultTheme },
          themeTokens: { ...defaultTheme }
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
        loadStatus: ThemeLoadStatusSchema.enum.error,
        error: error instanceof Error ? error : new Error(String(error)),
        // Always use default tokens when there's an error
        tokens: { ...defaultTheme },
        themeTokens: { ...defaultTheme }
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
