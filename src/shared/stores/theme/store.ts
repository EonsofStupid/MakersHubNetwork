
import { create } from 'zustand';
import { ThemeState, ThemeVariables, ThemeToken, ComponentTokens, ComponentStyles } from '@/shared/types/theme.types';

// Default theme variables
const defaultVariables: ThemeVariables = {
  background: "hsl(240 10% 3.9%)",
  foreground: "hsl(0 0% 98%)",
  card: "hsl(240 10% 3.9%)",
  cardForeground: "hsl(0 0% 98%)",
  primary: "hsl(0 0% 98%)",
  primaryForeground: "hsl(240 5.9% 10%)",
  secondary: "hsl(240 3.7% 15.9%)",
  secondaryForeground: "hsl(0 0% 98%)",
  muted: "hsl(240 3.7% 15.9%)",
  mutedForeground: "hsl(240 5% 64.9%)",
  accent: "hsl(240 3.7% 15.9%)",
  accentForeground: "hsl(0 0% 98%)",
  destructive: "hsl(0 62.8% 30.6%)",
  destructiveForeground: "hsl(0 0% 98%)",
  border: "hsl(240 3.7% 15.9%)",
  input: "hsl(240 3.7% 15.9%)",
  ring: "hsl(240 4.9% 83.9%)",
  
  // Special effects
  effectColor: "#00F0FF",
  effectSecondary: "#FF2D6E",
  effectTertiary: "#00FF9D",
  
  // Animation timing
  transitionFast: "150ms",
  transitionNormal: "300ms",
  transitionSlow: "500ms",
  animationFast: "300ms",
  animationNormal: "500ms",
  animationSlow: "1000ms",
  
  // Radii
  radiusSm: "0.25rem",
  radiusMd: "0.5rem",
  radiusLg: "0.75rem",
  radiusFull: "9999px"
};

// Default theme state
const initialState: ThemeState = {
  theme: 'dark',
  tokens: [],
  componentTokens: [],
  variables: defaultVariables,
  componentStyles: {},
  isLoaded: false
};

// Create theme store
export const useThemeStore = create<ThemeState>(() => initialState);

// Helper functions
export const setTheme = (theme: string) => {
  useThemeStore.setState({ theme });
};

export const setTokens = (tokens: ThemeToken[]) => {
  useThemeStore.setState({ tokens });
};

export const setComponentTokens = (componentTokens: ComponentTokens[]) => {
  useThemeStore.setState({ componentTokens });
};

export const setVariables = (variables: Partial<ThemeVariables>) => {
  useThemeStore.setState(state => ({
    variables: { ...state.variables, ...variables }
  }));
};

export const setComponentStyles = (componentStyles: ComponentStyles) => {
  useThemeStore.setState({ componentStyles });
};

export const setThemeLoaded = (isLoaded: boolean) => {
  useThemeStore.setState({ isLoaded });
};

// Initialize theme system
export const initializeTheme = () => {
  // Set default theme
  setThemeLoaded(true);
};
