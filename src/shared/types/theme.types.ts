
// Theme Types
export interface ThemeState {
  theme: string;
  tokens: ThemeToken[];
  componentTokens: ComponentTokens[];
  variables: ThemeVariables;
  componentStyles: ComponentStyles;
  isLoaded: boolean;
  currentTheme: Theme | null;
  adminComponents: ComponentTokens[];
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  tokens?: Record<string, ThemeToken>;
  components?: Record<string, ComponentTokens>;
  design_tokens?: Record<string, any>;
}

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  type: string;
  value: string;
  category: string;
  description?: string;
  keyframes?: string;
}

export interface ComponentTokens {
  component_name: string;
  styles: Record<string, string>;
  context?: string;
  variants?: Record<string, Record<string, string>>;
}

export interface ComponentStyles {
  [component: string]: Record<string, string>;
}

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
  effectColor: string;
  effectSecondary: string;
  effectTertiary: string;
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  animationFast: string;
  animationNormal: string;
  animationSlow: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
}

// Theme log details type
export interface ThemeLogDetails {
  themeName?: string;
  theme?: string;
  cssVarsCount?: number;
  error?: string;
}
