
import { LogDetails } from './core/logging.types';

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

export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  enabled: boolean;
  color?: string;
  [key: string]: any;
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

export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: any;
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

export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

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

// Component specific theme types
export interface ThemeComponent {
  id?: string;
  name?: string;
  component_name?: string;
  styles?: Record<string, string>;
  tokens?: Record<string, string>;
}

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
  effects: ThemeEffect[];
  setEffects: (effects: ThemeEffect[]) => void;
  setVariables: (vars: Record<string, string>) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
}

export interface ThemeStoreActions {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  loadTheme?: (themeId: string) => Promise<void>;
}
