
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

// Theme interface
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

// Theme state interface
export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  theme: Theme | null;
  isLoaded: boolean;
  variables: Record<string, string>;
  componentStyles: Record<string, any>;
  animations: Record<string, any>;
}

export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  color?: string;
  enabled?: boolean;
  [key: string]: any;
}

// Theme effect type enum
export enum ThemeEffectType {
  NONE = 'none',
  CYBER = 'cyber',
  NEON = 'neon',
  ELECTRIC = 'electric',
  GLITCH = 'glitch',
  SYNTHWAVE = 'synthwave',
  HOLOGRAM = 'hologram',
  BLUR = 'blur',
  MORPH = 'morph',
  NOISE = 'noise',
  GRADIENT = 'gradient',
  PULSE = 'pulse',
  PARTICLE = 'particle',
  GRAIN = 'grain',
  GLOW = 'glow',
  SHADOW = 'shadow'
}
