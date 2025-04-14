
/**
 * Theme system types
 */
import { LogDetails } from '../core/logging.types';

// Theme effect types
export enum ThemeEffectType {
  NONE = 'none',
  BLUR = 'blur',
  GRAIN = 'grain',
  NOISE = 'noise',
  GLOW = 'glow',
  GLITCH = 'glitch',
  GRADIENT = 'gradient',
  CYBER = 'cyber',
  NEON = 'neon',
  PULSE = 'pulse',
  PARTICLE = 'particle',
  MORPH = 'morph',
  SHADOW = 'shadow'
}

// Theme effect
export interface ThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  intensity?: number;
  color?: string;
  duration?: number;
  delay?: number;
  selector?: string;
  config?: Record<string, any>;
  id?: string;
  [key: string]: any;
}

// Theme status
export enum ThemeStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

// Theme context
export enum ThemeContext {
  SITE = 'site',
  ADMIN = 'admin',
  APP = 'app'
}

// Theme variables
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

// Design tokens
export interface DesignTokens {
  colors?: ColorTokens;
  typography?: Record<string, any>;
  spacing?: Record<string, string>;
  borders?: Record<string, string>;
  shadows?: ShadowTokens;
  radii?: RadiusTokens;
  zIndices?: Record<string, string>;
  breakpoints?: Record<string, string>;
  transitions?: Record<string, string>;
  animations?: Record<string, any>;
  [key: string]: any;
}

// Color tokens
export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  destructive: string;
  destructiveForeground: string;
  popover: string;
  'popover-foreground': string;
  'card-foreground': string;
  'muted-foreground': string;
  border: string;
  input: string;
  ring: string;
  [key: string]: string;
}

// Shadow tokens
export interface ShadowTokens {
  inner: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  [key: string]: string;
}

// Radius tokens
export interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

// Component tokens
export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

// Theme component
export interface ThemeComponent {
  name: string;
  tokens: Record<string, string>;
  variants?: Record<string, Record<string, string>>;
  component_name?: string;
  styles?: Record<string, string>;
}

// Theme
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
  tokens?: ThemeToken[];
  components?: ThemeComponent[];
}

// Theme state
export interface ThemeState {
  themes: Theme[];
  activeThemeId: string;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor?: string;
  borderColor?: string;
  fontFamily?: string;
  cornerRadius?: number;
  animations?: boolean;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  variables?: Record<string, string>;
  isLoaded?: boolean;
  theme?: Theme | null;
}

// Theme token
export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
  type?: string;
  name?: string;
  value?: string;
  keyframes?: string;
}

// Theme log details
export interface ThemeLogDetails extends LogDetails {
  theme?: string;
  themeId?: string;
  success?: boolean;
  error?: string | Error;
  errorMessage?: string;
  details?: Record<string, unknown>;
  source?: string;
  tags?: string[];
}

// Theme effect types
export interface GlitchEffect extends ThemeEffect {
  type: ThemeEffectType.GLITCH | ThemeEffectType.NOISE;
  color?: string;
  frequency?: string | number;
  amplitude?: string | number;
}

export interface GradientEffect extends ThemeEffect {
  type: ThemeEffectType.GRADIENT;
  colors?: string[];
  speed?: number; 
}

export interface CyberEffect extends ThemeEffect {
  type: ThemeEffectType.CYBER | ThemeEffectType.NEON;
  glowColor?: string;
  scanLines?: boolean;
}

export interface PulseEffect extends ThemeEffect {
  type: ThemeEffectType.PULSE;
  color?: string;
  minOpacity?: number;
  maxOpacity?: number;
}

export interface ParticleEffect extends ThemeEffect {
  type: ThemeEffectType.PARTICLE;
  color?: string;
  count?: number;
}

export interface MorphEffect extends ThemeEffect {
  type: ThemeEffectType.MORPH | ThemeEffectType.BLUR;
  intensity?: number;
  speed?: number;
}

// Theme effect props
export interface ThemeEffectProps {
  effect: ThemeEffect;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}

// Theme effect provider props
export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: ThemeEffect;
}

// Helper function to convert legacy effect types
export const normalizeEffectType = (type: string): ThemeEffectType => {
  const mappings: Record<string, ThemeEffectType> = {
    'glitch': ThemeEffectType.NOISE,
    'cyber': ThemeEffectType.NEON,
    'morph': ThemeEffectType.BLUR
  };
  
  return mappings[type] || (type as ThemeEffectType);
};
