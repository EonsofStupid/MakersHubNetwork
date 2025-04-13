
import { create } from 'zustand';
import { 
  Theme, 
  ThemeState, 
  ComponentTokens, 
  DesignTokens, 
  ThemeStatus, 
  ThemeContext,
  ThemeToken
} from '@/shared/types/theme.types';

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
export const useThemeStore = create<ThemeState & {
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
        tokens: {
          'primary': {
            value: '#00ffcc',
            type: 'color',
            description: 'Primary brand color'
          },
          'secondary': {
            value: '#ff00cc',
            type: 'color',
            description: 'Secondary brand color'
          },
          'background': {
            value: '#111122',
            type: 'color',
            description: 'Background color'
          },
          'text': {
            value: '#ffffff',
            type: 'color',
            description: 'Text color'
          },
          'spacing-sm': {
            value: '0.5rem',
            type: 'spacing',
            description: 'Small spacing'
          },
          'spacing-md': {
            value: '1rem',
            type: 'spacing',
            description: 'Medium spacing'
          },
          'spacing-lg': {
            value: '2rem',
            type: 'spacing',
            description: 'Large spacing'
          }
        },
        designTokens: {
          colors: {
            primary: {
              value: '#00ffcc',
              type: 'color',
              description: 'Primary brand color'
            },
            secondary: {
              value: '#ff00cc',
              type: 'color',
              description: 'Secondary brand color'
            }
          }
        },
        componentTokens: {
          styles: {
            button: {
              styles: {
                backgroundColor: 'var(--colors-primary)',
                textColor: 'var(--colors-text)',
                borderRadius: '4px'
              }
            }
          }
        }
      };
      
      // Update state with the mock theme
      set({ 
        themes: [mockTheme],
        activeThemeId: mockTheme.id,
        designTokens: mockTheme.designTokens || initialDesignTokens,
        componentTokens: mockTheme.componentTokens || initialComponentTokens,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load theme',
        isLoading: false
      });
    }
  },

  updateComponentToken: (component, token, value) => {
    set(state => {
      const updatedTokens = { ...state.componentTokens };
      
      if (!updatedTokens.styles[component]) {
        updatedTokens.styles[component] = {
          styles: {}
        };
      }
      
      updatedTokens.styles[component].styles[token] = value;
      
      return { componentTokens: updatedTokens };
    });
  },

  updateDesignToken: (category, token, value) => {
    set(state => {
      const updatedTokens = { ...state.designTokens };
      
      if (!updatedTokens[category]) {
        updatedTokens[category] = {};
      }
      
      updatedTokens[category][token] = {
        value,
        type: category === 'colors' ? 'color' : 
              category === 'spacing' ? 'spacing' : 
              category === 'typography' ? 'typography' : 'color'
      };
      
      return { designTokens: updatedTokens };
    });
  },

  resetTheme: () => {
    set({
      activeThemeId: null,
      designTokens: initialDesignTokens,
      componentTokens: initialComponentTokens
    });
  }
}));

// Selectors for easier state access
export const selectCurrentTheme = (state: ThemeState) => 
  state.themes.find(theme => theme.id === state.activeThemeId);

export const selectThemeTokens = (state: ThemeState) => state.designTokens;
export const selectThemeComponents = (state: ThemeState) => state.componentTokens;
