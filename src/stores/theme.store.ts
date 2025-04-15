
import { create } from 'zustand';
import { TokenMap, ComponentTokenMap, ThemeStoreState } from '@/shared/types/theme.types';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * Theme store for managing application theming
 */
export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  theme: 'default',
  variables: {},
  componentTokens: {},
  isDark: false,
  isLoading: false,
  effects: [],
  error: null,
  
  // Set current theme
  setTheme: async (theme: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Would normally fetch theme from API
      logger.log(LogLevel.INFO, LogCategory.THEME, `Setting theme to ${theme}`);
      
      // Mock theme loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Set theme variables and metadata
      set({
        theme,
        isLoading: false
      });
      
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.log(LogLevel.ERROR, LogCategory.THEME, `Error setting theme: ${errorMessage}`);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Set theme variables
  setVariables: (variables: TokenMap) => {
    set({ variables });
  },
  
  // Set component-specific tokens
  setComponentTokens: (componentTokens: ComponentTokenMap) => {
    set({ componentTokens });
  },
  
  // Set dark mode
  setDarkMode: (isDark: boolean) => {
    set({ isDark });
  },
  
  // Set theme effects
  setEffects: (effects: string[]) => {
    set({ effects });
  },
  
  // Set error state
  setError: (error: string | null) => {
    set({ error });
  }
}));
