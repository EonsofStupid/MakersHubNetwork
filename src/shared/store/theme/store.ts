
import { create } from 'zustand';
import { Theme, ThemeState, ComponentTokens, DesignTokens } from '@/shared/types/theme.types';
import { ThemeContext, ThemeStatus } from '@/shared/types/shared.types';

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
  loadTheme: (themeId: string) => Promise<void>;
  updateComponentToken: (component: string, token: string, value: string) => void;
  updateDesignToken: (category: string, token: string, value: string) => void;
  resetTheme: () => void;
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

  loadTheme: async (themeId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock theme loading
      const mockTheme: Theme = {
        id: themeId,
        name: 'Cyberpunk',
        description: 'A futuristic cyberpunk theme',
        status: ThemeStatus.ACTIVE,
        context: ThemeContext.SITE,
        is_system: true,
        is_default: true,
        design_tokens: {
          colors: {
            primary: '#00ffcc',
            secondary: '#ff00cc',
            background: '#111122',
            text: '#ffffff'
          },
          spacing: {
            small: '0.5rem',
            medium: '1rem',
            large: '2rem'
          }
        },
        component_tokens: {
          button: {
            backgroundColor: 'var(--colors-primary)',
            textColor: 'var(--colors-text)',
            borderRadius: '4px'
          },
          card: {
            backgroundColor: 'var(--colors-background)',
            boxShadow: '0 0 10px rgba(0,255,204,0.5)'
          }
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1
      };
      
      const mockComponentTokens = mockTheme.component_tokens;
      
      set({
        themes: [mockTheme],
        activeTheme: themeId,
        componentTokens: mockComponentTokens,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load theme:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load theme'
      });
    }
  },

  updateComponentToken: (component: string, token: string, value: string) => {
    set((state) => {
      const updatedTokens = { ...state.componentTokens };
      if (!updatedTokens[component]) {
        updatedTokens[component] = {};
      }
      
      updatedTokens[component][token] = value;
      
      return { componentTokens: updatedTokens };
    });
  },

  updateDesignToken: (category: string, token: string, value: string) => {
    set((state) => {
      const activeTheme = state.themes.find(theme => theme.id === state.activeTheme);
      if (activeTheme) {
        const updatedDesignTokens = { ...activeTheme.design_tokens };
        if (!updatedDesignTokens[category]) {
          updatedDesignTokens[category] = {};
        }
        
        updatedDesignTokens[category][token] = value;
        
        const updatedThemes = state.themes.map(theme => {
          if (theme.id === state.activeTheme) {
            return { ...theme, design_tokens: updatedDesignTokens };
          }
          return theme;
        });
        
        return { themes: updatedThemes };
      }
      return { themes: state.themes };
    });
  },

  resetTheme: () => {
    set(initialState);
  }
}));

export { useThemeStore };
