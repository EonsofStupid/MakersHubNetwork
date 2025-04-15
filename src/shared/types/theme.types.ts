
import { 
  LogCategoryType, 
  LogLevel, 
  Theme, 
  ThemeState, 
  ThemeToken, 
  ThemeComponent, 
  DesignTokens, 
  ComponentTokens, 
  ThemeEffect, 
  ThemeEffectType,
  TokenMap,
  ComponentTokenMap
} from './shared.types';

// Export the types re-exported from shared.types
export type {
  Theme,
  ThemeState,
  ThemeToken,
  ThemeComponent,
  DesignTokens,
  ComponentTokens,
  ThemeEffect,
  ThemeEffectType,
  TokenMap,
  ComponentTokenMap
};

// Theme variables interface
export interface ThemeVariables {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  // Effect-specific colors
  effectColor: string;
  effectSecondary: string;
  effectTertiary: string;
  // Transition times
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  animationFast: string;
  animationNormal: string;
  animationSlow: string;
  // Border radii
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
}

// Theme store actions interface
export interface ThemeStoreActions {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  loadTheme?: (themeId: string) => Promise<void>;
  setIsLoading?: (loading: boolean) => void;
  setError?: (error: string | null) => void;
}

// Theme service response type
export interface ThemeServiceResponse {
  success: boolean;
  theme?: Theme;
  error?: string;
}

// Theme log details type
export interface ThemeLogDetails {
  theme?: string;
  error?: string;
  cssVarsCount?: number;
}
