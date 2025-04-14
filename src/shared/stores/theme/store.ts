
import { create } from 'zustand';
import { Theme, ThemeState } from '@/shared/types/shared.types';
import { tokensToCssVars } from '../../utils/themeUtils';

// Extend ThemeState with actions for the store
interface ThemeStoreState extends ThemeState {
  // Actions
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  loadThemes: () => Promise<void>;
  tokens?: any[]; // Add missing tokens property
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  themes: [],
  activeThemeId: null,
  theme: null,
  designTokens: {},
  componentTokens: {},
  variables: {},
  isLoading: false,
  error: null,
  isDark: false,
  primaryColor: '',
  backgroundColor: '',
  textColor: '',
  tokens: [], // Initialize tokens array
  
  setThemes: (themes) => set({ themes }),
  
  setActiveTheme: (themeId) => {
    const { themes } = get();
    const theme = themes.find(t => t.id === themeId);
    
    if (theme) {
      set({ 
        activeThemeId: themeId,
        theme,
        isDark: theme.isDark
      });
    }
  },
  
  loadThemes: async () => {
    set({ isLoading: true });
    
    try {
      // For now, return empty themes until API is implemented
      set({ 
        themes: [], 
        isLoading: false 
      });
      return Promise.resolve();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load themes',
        isLoading: false
      });
      return Promise.reject(error);
    }
  }
}));
