
import { ThemeEffect, LogLevel, LogCategoryType } from './shared.types';

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

// Design tokens interface
export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: {
    fontFamily?: string;
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, number | string>;
    lineHeight?: Record<string, string | number>;
  };
  spacing?: Record<string, string>;
  borders?: Record<string, string>;
  shadows?: Record<string, string>;
  radii?: Record<string, string>;
  zIndices?: Record<string, string | number>;
  breakpoints?: Record<string, string>;
  transitions?: Record<string, string>;
  animations?: Record<string, any>;
  [key: string]: any;
}

// Component tokens interface
export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

// Theme token interface
export interface ThemeToken {
  name?: string;
  token_name?: string;
  value?: string;
  token_value?: string;
  type?: string;
  keyframes?: string;
  description?: string;
}

// Theme component interface
export interface ThemeComponent {
  name?: string;
  component_name?: string;
  styles?: Record<string, string>;
  tokens?: Record<string, string>;
}

// Theme interface
export interface Theme {
  id: string;
  name: string;
  label?: string;
  description?: string;
  tokens?: ThemeToken[];
  components?: ThemeComponent[];
  isDark?: boolean;
  variables?: ThemeVariables;
  designTokens?: DesignTokens;
  componentTokens?: ComponentTokens;
}

// Theme state interface
export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  theme?: Theme | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  variables: Record<string, string>;
  componentStyles?: Record<string, Record<string, string>>;
  animations?: Record<string, any>;
  isLoaded?: boolean;
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

// Token maps for simplified access
export interface TokenMap {
  [key: string]: string;
}

export interface ComponentTokenMap {
  [component: string]: TokenMap;
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
