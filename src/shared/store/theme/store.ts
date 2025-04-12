
import { create } from 'zustand';
import { ComponentTokens, DesignTokens, Theme, ThemeState, ThemeVariables } from '@/shared/types/theme.types';

// Default theme state
const initialState: ThemeState = {
  themes: [],
  activeTheme: 'cyberpunk',
  componentTokens: {} as ComponentTokens,
  designTokens: {} as DesignTokens,
  isLoading: true
};

// Create theme store
export const useThemeStore = create<
  ThemeState & {
    setActiveTheme: (themeId: string) => void;
    loadTheme: (themeId: string) => Promise<void>;
    updateComponentToken: (component: string, token: string, value: string) => void;
    updateDesignToken: (category: string, token: string, value: string) => void;
    resetTheme: () => void;
  }
>((set, get) => ({
  ...initialState,

  setActiveTheme: (themeId: string) => {
    set({ activeTheme: themeId });
    // This would typically trigger a theme load
  },

  loadTheme: async (themeId: string) => {
    set({ isLoading: true });
    
    try {
      // Mock theme loading
      const mockTheme: Theme = {
        id: themeId,
        name: 'Cyberpunk',
        description: 'A futuristic cyberpunk theme',
        is_system: true,
        is_default: true
      };
      
      const mockDesignTokens: DesignTokens = {
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
      };
      
      const mockComponentTokens: ComponentTokens = {
        button: {
          backgroundColor: 'var(--colors-primary)',
          textColor: 'var(--colors-text)',
          borderRadius: '4px'
        },
        card: {
          backgroundColor: 'var(--colors-background)',
          boxShadow: '0 0 10px rgba(0,255,204,0.5)'
        }
      };
      
      set({
        themes: [mockTheme],
        activeTheme: themeId,
        designTokens: mockDesignTokens,
        componentTokens: mockComponentTokens,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load theme:', error);
      set({ isLoading: false });
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
      const updatedTokens = { ...state.designTokens };
      if (!updatedTokens[category]) {
        updatedTokens[category] = {};
      }
      
      updatedTokens[category][token] = value;
      
      return { designTokens: updatedTokens };
    });
  },

  resetTheme: () => {
    set(initialState);
  }
}));
