import { LogDetails } from '@/shared/types/shared.types';

// Theme status enum
export enum ThemeStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

// Theme context enum
export enum ThemeContext {
  SITE = 'SITE',
  ADMIN = 'ADMIN',
  APP = 'APP'
}

// Theme effect type enum
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

// Theme base interface
export interface Theme {
  id: string;
  name: string;
  label: string;
  description?: string;
  isDark: boolean;
  status: ThemeStatus;
  context: ThemeContext;
  variables: ThemeVariables;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Theme token interface
export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
}

// Design tokens interface
export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: Record<string, any>;
  spacing?: Record<string, string>;
  borders?: Record<string, string>;
  shadows?: Record<string, string>;
  radii?: Record<string, string>;
  zIndices?: Record<string, string>;
  breakpoints?: Record<string, string>;
  transitions?: Record<string, string>;
  animations?: Record<string, any>;
  [key: string]: any;
}

// Component tokens interface
export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

// Theme effect interface
export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  color?: string;
  selector?: string;
  config?: Record<string, any>;
}

// Theme state interface
export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
}
