
import { create } from 'zustand';
import { z } from 'zod';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { errorToObject } from '@/shared/rendering';
import { ThemeTokensSchema } from '@/theme/tokenSchema';
import { Theme, ThemeContext } from '@/types/theme';
import { ThemeContextSchema } from '@/types/themeContext';
import defaultTheme from '@/theme/defaultTheme';
import { supabase } from '@/lib/supabase';
import { safeLocalStorage, persistThemeTokens } from '@/lib/theme/safeStorage';

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

// Type for our theme tokens
export type StoreThemeTokens = z.infer<typeof ThemeTokensSchema>;

interface ThemeState {
  currentTheme: Theme | null;
  isLoading: boolean;
  error: Error | null;
  loadStatus: ThemeLoadStatus;
  tokens: StoreThemeTokens;
  context: ThemeContext;
  adminComponents: any[];
  themeTokens: StoreThemeTokens;
  
  // Actions
  loadTheme: (contextOrThemeId?: ThemeContext | string) => Promise<void>;
  setTheme: (themeId: string) => Promise<void>;
  loadAdminComponents: () => Promise<void>;
}

const initialThemeState: Omit<ThemeState, 'loadTheme' | 'setTheme' | 'loadAdminComponents'> = {
  currentTheme: null,
  isLoading: false,
  error: null,
  loadStatus: 'idle',
  tokens: { ...defaultTheme },
  context: 'app',
  adminComponents: [],
  themeTokens: { ...defaultTheme },
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  ...initialThemeState,

  loadTheme: async (contextOrThemeId?: ThemeContext | string) => {
    try {
      set({
        isLoading: true,
        loadStatus: 'loading',
        error: null
      });

      // Parse input as either themeId or context
      let options: ThemeServiceOptions = {};
      let context: ThemeContext = 'app';
      
      if (contextOrThemeId) {
        // Try to parse as ThemeContext
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
        options = { context: 'app' };
        getLogger().info('Loading default app theme');
      }

      // Call theme service edge function
      const { data: themeData, error: themeError } = await supabase.functions.invoke('theme-service', {
        body: { 
          context: options.context,
          id: options.id,
          name: options.name,
          isDefault: options.isDefault !== false
        }
      });

      if (themeError || !themeData) {
        throw new Error(themeError?.message || 'Failed to load theme data');
      }

      const { tokens, theme } = themeData;
      
      // Persist tokens for offline use if available
      if (tokens) {
        persistThemeTokens(tokens);
      }

      set({
        currentTheme: theme || null,
        tokens: tokens || { ...defaultTheme },
        themeTokens: tokens || { ...defaultTheme },
        context,
        isLoading: false,
        loadStatus: 'success',
        error: null
      });

      getLogger().info(`Theme loaded successfully ${theme?.name || '(fallback)'}`, {
        category: LogCategory.THEME,
        details: {
          themeId: theme?.id || 'default',
          context: options.context,
          isFallback: !theme
        }
      });
    } catch (error) {
      const errorObj = errorToObject(error);
      getLogger().error('Error loading theme', {
        category: LogCategory.THEME,
        details: errorObj
      });

      // Load fallback from localStorage if available
      const localTokens = safeLocalStorage('impulse-theme', null);
      
      set({
        isLoading: false,
        loadStatus: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
        // Use localStorage fallback or default tokens
        tokens: localTokens || { ...defaultTheme },
        themeTokens: localTokens || { ...defaultTheme }
      });
      
      // Even when there's an error, try to apply some theme for better UX
      applyFallbackTheme();
    }
  },

  setTheme: async (themeId: string) => {
    try {
      set({
        isLoading: true,
        loadStatus: 'loading',
        error: null
      });

      // Call theme service to get specific theme
      const { data: themeData, error: themeError } = await supabase.functions.invoke('theme-service', {
        body: { id: themeId }
      });

      if (themeError || !themeData) {
        throw new Error(themeError?.message || 'Failed to load theme data');
      }

      const { tokens, theme } = themeData;
      
      if (!theme) {
        throw new Error('Theme not found');
      }

      // Update store with theme data
      set({
        currentTheme: theme,
        tokens: tokens || { ...defaultTheme },
        themeTokens: tokens || { ...defaultTheme },
        isLoading: false,
        loadStatus: 'success',
        error: null
      });

      getLogger().info(`Theme set successfully: ${theme.name}`, {
        category: LogCategory.THEME,
        details: {
          themeId: theme.id
        }
      });
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

// Apply fallback theme directly to DOM
function applyFallbackTheme() {
  try {
    const root = document.documentElement;
    
    // Apply critical CSS variables as fallback
    root.style.setProperty('--primary', defaultTheme.primary);
    root.style.setProperty('--secondary', defaultTheme.secondary);
    root.style.setProperty('--background', defaultTheme.background);
    root.style.setProperty('--foreground', defaultTheme.foreground);
    root.style.setProperty('--site-effect-color', defaultTheme.effectPrimary);
    root.style.setProperty('--site-effect-secondary', defaultTheme.effectSecondary);
  } catch (error) {
    console.error('Failed to apply fallback theme', error);
  }
}
