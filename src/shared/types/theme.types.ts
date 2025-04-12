
import { LogCategory } from "./shared.types";

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
  
  // Special effects
  effectColor: string;
  effectSecondary: string;
  effectTertiary: string;
  
  // Animation timing
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  animationFast: string;
  animationNormal: string;
  animationSlow: string;
  
  // Radii
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
}

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  fallback_value: string;
  category: string;
}

export interface ComponentStyles {
  [key: string]: Record<string, string>;
}

export interface ComponentTokens {
  id: string;
  component_name: string;
  styles: Record<string, string>;
}

export interface ThemeState {
  theme: string;
  tokens: ThemeToken[];
  componentTokens: ComponentTokens[];
  variables: ThemeVariables;
  componentStyles: ComponentStyles;
  isLoaded: boolean;
}

export interface ThemeLogDetails {
  category: LogCategory;
  theme?: string;
  event: string;
  variables?: Partial<ThemeVariables>;
}
