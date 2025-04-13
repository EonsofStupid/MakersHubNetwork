
import { create } from 'zustand';
import { Theme, ThemeState, ComponentTokens, DesignTokens } from '@/shared/types/theme.types';

// Initial state
const initialState: ThemeState = {
  themes: [],
  activeThemeId: '',
  componentTokens: {
    button: {},
    card: {},
    input: {},
    badge: {},
    alert: {},
  },
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
    set({ activeThemeId: themeId });
  },

  setDesignTokens: (tokens) => {
    set((state) => {
      const activeTheme = state.themes.find(theme => theme.id === state.activeThemeId);
      if (activeTheme) {
        const updatedThemes = state.themes.map(theme => {
          if (theme.id === state.activeThemeId) {
            return { ...theme, designTokens: tokens };
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
