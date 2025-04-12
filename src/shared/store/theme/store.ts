
import { create } from 'zustand';
import { ThemeState, Theme, ThemeToken, ComponentTokens } from '../../types/theme.types';

const initialState: ThemeState = {
  theme: 'default',
  tokens: [],
  componentTokens: [],
  adminComponents: [],
  variables: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#ffffff',
    cardForeground: '#000000',
    primary: '#0c4a6e',
    primaryForeground: '#ffffff',
    secondary: '#f1f5f9',
    secondaryForeground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#0c4a6e',
    effectColor: '#00F0FF',
    effectSecondary: '#FF2D6E',
    effectTertiary: '#FFFF00',
    transitionFast: '0.15s',
    transitionNormal: '0.3s',
    transitionSlow: '0.5s',
    animationFast: '0.5s',
    animationNormal: '1s',
    animationSlow: '2s',
    radiusSm: '0.25rem',
    radiusMd: '0.5rem',
    radiusLg: '0.75rem',
    radiusFull: '9999px',
  },
  componentStyles: {},
  isLoaded: false,
  currentTheme: null,
};

export const useThemeStore = create<ThemeState>()((set) => ({
  ...initialState,
  
  setTheme: (theme: string) => set({ theme }),
  setCurrentTheme: (theme: Theme) => set({ currentTheme: theme }),
  setTokens: (tokens: ThemeToken[]) => set({ tokens }),
  setComponentTokens: (componentTokens: ComponentTokens[]) => set({ componentTokens }),
  setVariables: (variables: Partial<ThemeState['variables']>) => 
    set((state) => ({ 
      variables: { ...state.variables, ...variables } 
    })),
  setLoaded: (isLoaded: boolean) => set({ isLoaded }),
  setComponentStyles: (componentStyles: ThemeState['componentStyles']) => set({ componentStyles }),
  setAdminComponentTokens: (adminComponents: ComponentTokens[]) => set({ adminComponents }),
  
  // Theme initialization
  initializeTheme: (theme: Theme) => set({
    currentTheme: theme,
    isLoaded: true,
  }),
  
  // Theme reset
  resetTheme: () => set(initialState),
}));

// Selector functions
export const selectCurrentTheme = (state: ThemeState) => state.currentTheme;
export const selectThemeTokens = (state: ThemeState) => state.tokens;
export const selectThemeComponents = (state: ThemeState) => state.componentStyles;
