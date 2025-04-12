
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

export interface Theme {
  name: string;
  label: string;
  isDark: boolean;
  variables: ThemeVariables;
}

export interface ComponentTokens {
  [component: string]: Record<string, string>;
}

export interface ThemeLogDetails {
  theme?: string;
  action?: string;
  component?: string;
  status?: string;
}

export enum ThemeEffectType {
  NONE = 'none',
  GLOW = 'glow',
  GRADIENT = 'gradient',
  PARTICLE = 'particle',
  BLUR = 'blur',
  NEON = 'neon',
  SHADOW = 'shadow',
  PULSE = 'pulse'
}

export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  color?: string;
  selector?: string;
  config?: Record<string, any>;
}
