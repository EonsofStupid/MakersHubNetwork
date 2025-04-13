
import { ThemeEffect } from './theme/effects';

/**
 * Theme interface
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  effects?: ThemeEffectSettings;
  isActive?: boolean;
  isSystem?: boolean;
  isCustom?: boolean;
  version: number;
  meta?: Record<string, any>;
  tokens?: ThemeToken[];
  components?: ThemeComponent[];
  variables?: Record<string, string>;
}

/**
 * Theme token interface
 */
export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  type: string;
  category: string;
  description?: string;
  keyframes?: string;
  value?: string;
}

/**
 * Theme component interface
 */
export interface ThemeComponent {
  id: string;
  component_name: string;
  styles: Record<string, any>;
}

/**
 * Design tokens interface
 */
export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  effects?: EffectTokens;
  radius?: RadiusTokens;
  shadows?: ShadowTokens;
}

/**
 * Color tokens interface
 */
export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  card: string;
  cardForeground: string;
  destructive: string;
  destructiveForeground: string;
  [key: string]: string;
}

/**
 * Spacing tokens interface
 */
export interface SpacingTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  [key: string]: string;
}

/**
 * Typography tokens interface
 */
export interface TypographyTokens {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
    [key: string]: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    [key: string]: string;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    [key: string]: string;
  };
  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
    [key: string]: string;
  };
}

/**
 * Effect tokens interface
 */
export interface EffectTokens {
  blur: Record<string, string>;
  glow: Record<string, string>;
  [key: string]: Record<string, string>;
}

/**
 * Radius tokens interface
 */
export interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
  [key: string]: string;
}

/**
 * Shadow tokens interface
 */
export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
  [key: string]: string;
}

/**
 * Component tokens interface
 */
export interface ComponentTokens {
  button: Record<string, string>;
  card: Record<string, string>;
  input: Record<string, string>;
  badge: Record<string, string>;
  alert: Record<string, string>;
  [key: string]: Record<string, string>;
}

/**
 * Theme effect settings interface
 */
export interface ThemeEffectSettings {
  activeEffects: ThemeEffect[];
  intensity: Record<string, number>;
  options: Record<string, Record<string, any>>;
}

/**
 * Theme state for global theme store
 */
export interface ThemeState {
  themes: Theme[];
  activeThemeId: string;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  designTokens?: DesignTokens;
}

/**
 * Theme token object for design system
 */
export interface TokenObject {
  key: string;
  value: string;
  description?: string;
}

/**
 * Theme log details
 */
export interface ThemeLogDetails {
  themeId: string;
  userId?: string;
  action: string;
  component?: string;
  previousValue?: any;
  newValue?: any;
  timestamp: Date;
}

/**
 * Theme effect type
 */
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

/**
 * Theme context
 */
export enum ThemeContext {
  SITE = 'site',
  ADMIN = 'admin',
  APP = 'app',
}

/**
 * Theme status
 */
export enum ThemeStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}
