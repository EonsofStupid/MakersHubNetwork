
import { create } from 'zustand';
import { Theme, ThemeState, ComponentTokens, DesignTokens, ThemeStatus, ThemeContext } from '@/shared/types/theme.types';

// Initial design tokens
const initialDesignTokens: DesignTokens = {
  colors: {},
  spacing: {},
  typography: {},
  effects: {},
  borders: {}
};

// Initial component tokens
const initialComponentTokens: ComponentTokens = {
  styles: {}
};

// Initial state
const initialState: ThemeState = {
  themes: [],
  activeThemeId: null,
  designTokens: initialDesignTokens,
  componentTokens: initialComponentTokens,
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
        return { themes: updatedThemes, designTokens: tokens };
      }
      return { designTokens: tokens };
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
        designTokens: {
          colors: {
            primary: { value: '#00ffcc', description: 'Primary brand color' },
            secondary: { value: '#ff00cc', description: 'Secondary brand color' },
            background: { value: '#111122', description: 'Background color' },
            text: { value: '#ffffff', description: 'Text color' }
          },
          spacing: {
            small: { value: '0.5rem', description: 'Small spacing' },
            medium: { value: '1rem', description: 'Medium spacing' },
            large: { value: '2rem', description: 'Large spacing' }
          }
        },
        componentTokens: {
          styles: {
            button: {
              backgroundColor: 'var(--colors-primary)',
              textColor: 'var(--colors-text)',
              borderRadius: '4px'
            },
            card: {
              backgroundColor: 'var(--colors-background)',
              boxShadow: '0 0 10px rgba(0,255,204,0.5)'
            }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const mockComponentTokens = mockTheme.componentTokens || initialComponentTokens;
      const mockDesignTokens = mockTheme.designTokens || initialDesignTokens;
      
      set({
        themes: [mockTheme],
        activeThemeId: themeId,
        componentTokens: mockComponentTokens,
        designTokens: mockDesignTokens,
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
      if (!updatedTokens.styles[component]) {
        updatedTokens.styles[component] = {};
      }
      
      updatedTokens.styles[component][token] = value;
      
      return { componentTokens: updatedTokens };
    });
  },

  updateDesignToken: (category: string, token: string, value: string) => {
    set((state) => {
      const updatedDesignTokens = { ...state.designTokens };
      if (!updatedDesignTokens[category]) {
        updatedDesignTokens[category] = {};
      }
      
      if (typeof updatedDesignTokens[category] === 'object' && updatedDesignTokens[category] !== null) {
        const categoryObj = updatedDesignTokens[category] as Record<string, any>;
        categoryObj[token] = { value };
      }
      
      const updatedThemes = state.themes.map(theme => {
        if (theme.id === state.activeThemeId) {
          return { 
            ...theme, 
            designTokens: updatedDesignTokens,
            updatedAt: new Date().toISOString()
          };
        }
        return theme;
      });
      
      return { themes: updatedThemes, designTokens: updatedDesignTokens };
    });
  },

  resetTheme: () => {
    set(initialState);
  }
}));

export { useThemeStore };
