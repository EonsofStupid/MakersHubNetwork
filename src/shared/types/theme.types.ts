
/**
 * Import base types from shared.types.ts
 */
import { ThemeEffectType, LogDetails } from './shared.types';

/**
 * Theme status enum
 */
export enum ThemeStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

/**
 * Theme context enum
 */
export enum ThemeContext {
  SITE = 'SITE',
  ADMIN = 'ADMIN',
  APP = 'APP'
}

/**
 * Theme variables interface
 */
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
  cardForeground: string; 
  destructive: string; 
  destructiveForeground: string; 
  popover: string;
  'popover-foreground': string;
  card: string;
  'card-foreground': string;
  'muted-foreground': string;
  border: string;
  input: string;
  ring: string;
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
}

/**
 * Shadow tokens interface
 */
export interface ShadowTokens {
  inner: string; 
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/**
 * Theme base interface
 */
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

/**
 * Theme token interface
 */
export interface ThemeToken {
  id: string;
  name: string;
  value: string;
  type: string;
  category: string;
  description?: string;
  keyframes?: string;
}

/**
 * Theme component interface
 */
export interface ThemeComponent {
  id: string;
  component_name: string;
  styles: Record<string, string>;
  description?: string;
}

/**
 * Design tokens interface
 */
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

/**
 * Component tokens interface
 */
export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

/**
 * Theme state interface
 */
export interface ThemeState {
  themes: Theme[];
  activeThemeId: string;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string; 
  borderColor: string;
  fontFamily: string;
  cornerRadius: number;
  animations: boolean;
  designTokens?: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  variables?: Record<string, string>;
  isLoaded?: boolean;
  theme?: Theme | null;
}

/**
 * Theme log details type for theme-related logs
 */
export interface ThemeLogDetails extends LogDetails {
  theme?: string;
  themeId?: string;
  success?: boolean;
  errorMessage?: string;
  details?: Record<string, unknown>;
}
