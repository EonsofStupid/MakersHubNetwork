
/**
 * Core theme type definitions - Single source of truth
 */

// Theme context and status enums
export type ThemeContext = 'site' | 'admin' | 'chat';
export type ThemeStatus = 'draft' | 'published' | 'archived';

// Base theme component interface
export interface BaseThemeComponent {
  id: string;
  component_name: string;
  styles: Record<string, any>;
  description?: string;
  created_at?: string | null;
  updated_at?: string | null;
  context?: ThemeContext;
}

/**
 * Component Tokens structure - may have optional theme_id
 */
export interface ComponentTokens extends BaseThemeComponent {
  theme_id?: string;
}

/**
 * Theme Component structure - requires theme_id
 */
export interface ThemeComponent extends BaseThemeComponent {
  theme_id: string; // Required here
}

// Transform utility
export function componentTokenToThemeComponent(token: ComponentTokens): ThemeComponent {
  return {
    ...token,
    theme_id: token.theme_id || ''
  };
}

/**
 * Theme Token structure
 */
export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
  fallback_value?: string;
  theme_id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Typography definition - core type for both site and admin
 */
export interface ThemeTypography {
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  sizes: {
    xs: string;
    sm: string;
    base: string;
    md: string; 
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  weights: {
    light: number;
    normal: number;
    medium: number;
    bold: number;
  };
  lineHeights: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  letterSpacing?: Record<string, string>;
}

/**
 * Theme Effects definition
 */
export interface ThemeEffects {
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  blurs?: Record<string, string>;
  gradients?: Record<string, string>;
  glow: {
    primary: string;
    secondary: string;
    hover: string;
  };
}

/**
 * Animation definition
 */
export interface ThemeAnimation {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  curves: {
    bounce: string;
    ease: string;
    spring: string;
    linear: string;
  };
  transitions?: Record<string, string>;
  keyframes?: Record<string, string>;
}

/**
 * Core colors definition
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    main: string;
    overlay: string;
    card: string;
    alt: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
  };
  borders: {
    normal: string;
    hover: string;
    active: string;
    focus: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

/**
 * Component theme properties
 */
export interface ThemeComponents {
  panel: {
    radius: string;
    padding: string;
    background: string;
  };
  button: {
    radius: string;
    padding: string;
    transition: string;
  };
  tooltip: {
    radius: string;
    padding: string;
    background: string;
  };
  input: {
    radius: string;
    padding: string;
    background: string;
  };
}

/**
 * Consolidated Design Tokens Structure - the core of all theme types
 */
export interface DesignTokensStructure {
  colors: ThemeColors;
  spacing?: Record<string, string>;
  typography: ThemeTypography;
  effects: ThemeEffects;
  animation: ThemeAnimation;
  components: ThemeComponents;
  // For backward compatibility, allow admin-specific tokens
  admin?: Record<string, any>;
  [key: string]: any; // Add index signature for JSON compatibility
}

/**
 * Base Theme interface - Core theme structure from the database
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: ThemeStatus;
  is_default: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  version: number;
  cache_key?: string;
  parent_theme_id?: string;
  design_tokens: DesignTokensStructure;
  component_tokens: ComponentTokens[];
  composition_rules?: Record<string, any>;
  cached_styles?: Record<string, any>;
  is_system?: boolean;
  is_active?: boolean;
  context?: ThemeContext;
}

/**
 * ThemeContext for React components
 */
export interface ThemeContextType {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ComponentTokens[];
  isLoading: boolean;
  error: Error | null;
  setTheme: (themeId: string) => Promise<void>;
}

// Type guard for ThemeToken
export function isThemeToken(obj: any): obj is ThemeToken {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.token_name === 'string' &&
    typeof obj.token_value === 'string' &&
    typeof obj.category === 'string'
  );
}

// Type guard for ComponentToken
export function isComponentToken(obj: any): obj is ComponentTokens {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.component_name === 'string' &&
    obj.styles !== undefined
  );
}

// Type guard for Theme
export function isTheme(obj: any): obj is Theme {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.is_default === 'boolean' &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string' &&
    typeof obj.version === 'number' &&
    obj.design_tokens !== undefined
  );
}
