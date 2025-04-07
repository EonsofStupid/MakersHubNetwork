
import { create } from 'zustand';
import { Theme } from '@/types/theme';
import { getTheme } from '@/services/themeService';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { errorToObject } from '@/shared/rendering';

// Define valid load status values
export type ThemeLoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface ThemeState {
  currentTheme: Theme | null;
  isLoading: boolean;
  error: Error | null;
  loadStatus: ThemeLoadStatus;
  tokens: Record<string, string>;
  loadTheme: (themeId?: string) => Promise<void>;
  setTheme: (themeId: string) => Promise<void>;
  adminComponents: any[];
  loadAdminComponents: () => Promise<void>;
  themeTokens: Record<string, string>;
}

const initialThemeState = {
  currentTheme: null,
  isLoading: false,
  error: null,
  loadStatus: 'idle' as ThemeLoadStatus,
  tokens: {},
  adminComponents: [],
  themeTokens: {},
};

export type ThemeStore = ThemeState;

export const useThemeStore = create<ThemeStore>((set, get) => ({
  ...initialThemeState,

  loadTheme: async (themeId?: string) => {
    try {
      set(state => ({
        ...state,
        isLoading: true,
        loadStatus: 'loading',
        error: null
      }));

      const { theme, isFallback } = await getTheme({ id: themeId });

      if (theme) {
        set(state => ({
          ...state,
          currentTheme: theme,
          tokens: theme.design_tokens?.colors || {},
          themeTokens: theme.design_tokens?.colors || {},
          isLoading: false,
          loadStatus: 'success',
          error: null
        }));

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

        set(state => ({
          ...state,
          isLoading: false,
          loadStatus: 'error' as ThemeLoadStatus,
          error: new Error(errorMessage)
        }));
      }
    } catch (error) {
      const errorObj = errorToObject(error);
      getLogger().error('Error loading theme', {
        category: LogCategory.THEME,
        details: errorObj
      });

      set(state => ({
        ...state,
        isLoading: false,
        loadStatus: 'error',
        error: error instanceof Error ? error : new Error(String(error))
      }));
    }
  },

  setTheme: async (themeId: string) => {
    try {
      set(state => ({
        ...state,
        isLoading: true,
        loadStatus: 'loading',
        error: null
      }));

      const { theme, isFallback } = await getTheme({ id: themeId });

      if (theme) {
        set(state => ({
          ...state,
          currentTheme: theme,
          tokens: theme.design_tokens?.colors || {},
          themeTokens: theme.design_tokens?.colors || {},
          isLoading: false,
          loadStatus: 'success',
          error: null
        }));

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

        set(state => ({
          ...state,
          isLoading: false,
          loadStatus: 'error',
          error: new Error(errorMessage)
        }));
      }
    } catch (error) {
      const errorObj = errorToObject(error);
      getLogger().error('Error setting theme', {
        category: LogCategory.THEME,
        details: errorObj
      });

      set(state => ({
        ...state,
        isLoading: false,
        loadStatus: 'error',
        error: error instanceof Error ? error : new Error(String(error))
      }));
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
