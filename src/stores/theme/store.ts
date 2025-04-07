import { create } from 'zustand';
import { Theme } from '@/types/theme';
import { getTheme } from '@/services/themeService';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { errorToObject } from '@/shared/utils/render';

interface ThemeState {
  currentTheme: Theme | null;
  isLoading: boolean;
  error: { message: string; details: Record<string, unknown> } | null;
  loadStatus: 'idle' | 'loading' | 'success' | 'error';
  tokens: Record<string, string>;
  loadTheme: (themeId?: string) => Promise<void>;
}

const initialThemeState = {
  currentTheme: null,
  isLoading: false,
  error: null,
  loadStatus: 'idle',
  tokens: {},
};

export type ThemeStore = ThemeState & {
  loadTheme: (themeId?: string) => Promise<void>;
};

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
          loadStatus: 'error',
          error: {
            message: errorMessage,
            details: { themeId }
          }
        }));
      }
    } catch (error) {
      const errorDetails = errorToObject(error);
      getLogger().error('Error loading theme', {
        category: LogCategory.THEME,
        details: errorDetails
      });

      set(state => ({
        ...state,
        isLoading: false,
        loadStatus: 'error',
        error: {
          message: error instanceof Error ? error.message : String(error),
          details: error instanceof Error ? (error as Record<string, unknown>) : { error: String(error) }
        }
      }));
    }
  },
}));
