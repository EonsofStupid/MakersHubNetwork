
import { create } from 'zustand';
import { Theme, ThemeState, ComponentTokens, DesignTokens } from '@/shared/types/theme.types';

// Initial state
const initialState: ThemeState = {
  themes: [],
  activeTheme: '',
  componentTokens: {},
  isLoading: false,
  error: null
};

// Create the store
const useThemeStore = create<ThemeState & {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}>((set) => ({
  ...initialState,

  setThemes: (themes) => {
    set({ themes });
  },

  setActiveTheme: (themeId) => {
    set({ activeTheme: themeId });
  },

  setDesignTokens: (tokens) => {
    set((state) => {
      const activeTheme = state.themes.find(theme => theme.id === state.activeTheme);
      if (activeTheme) {
        const updatedThemes = state.themes.map(theme => {
          if (theme.id === state.activeTheme) {
            return { ...theme, design_tokens: tokens };
          }
          return theme;
        });
        return { themes: updatedThemes };
      }
      return { themes: state.themes };
    });
  },

  setComponentTokens: (tokens) => {
    set({ componentTokens: tokens });
  },

  setIsLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },
}));

export { useThemeStore };
