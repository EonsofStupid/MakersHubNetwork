
import { create } from 'zustand';
import { 
  Theme, 
  ThemeState, 
  TokenMap, 
  ComponentTokenMap, 
  ThemeStoreActions 
} from '@/shared/types/theme.types';
import { LogLevel, LogCategory, ThemeEffect } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * Theme store for managing application theming
 */
export const useThemeStore = create<ThemeState & {
  effects: ThemeEffect[];
  setEffects: (effects: ThemeEffect[]) => void;
  setError: (error: string | null) => void;
  setTheme: (theme: string) => Promise<void>;
  setVariables: (variables: Record<string, string>) => void;
  setComponentTokens: (tokens: ComponentTokenMap) => void;
}>((set, get) => ({
  // State
  theme: 'default',
  variables: {},
  componentTokens: {},
  themes: [],
  activeThemeId: null,
  isDark: false,
  isLoading: false,
  effects: [],
  error: null,
  primaryColor: '',
  backgroundColor: '',
  textColor: '',
  designTokens: {},
  componentStyles: {},
  animations: {},
  isLoaded: false,
  
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
  setEffects: (effects: ThemeEffect[]) => {
    set({ effects });
  },
  
  // Set error state
  setError: (error: string | null) => {
    set({ error });
  },
  
  // Theme store actions
  setActiveTheme: (themeId: string) => {
    set({ activeThemeId: themeId });
  },
  
  setThemes: (themes: Theme[]) => {
    set({ themes });
  },
  
  setDesignTokens: (designTokens: any) => {
    set({ designTokens });
  }
}));
