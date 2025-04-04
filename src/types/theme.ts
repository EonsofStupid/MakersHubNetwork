
/**
 * Consolidated theme type definitions
 */

export type ThemeStatus = 'draft' | 'published' | 'archived';
export type ThemeContext = 'site' | 'admin' | 'chat';

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

export interface ComponentTokens {
  id: string;
  component_name: string;
  styles: Record<string, any>;
  description?: string;
  theme_id?: string;
  created_at?: string | null;
  updated_at?: string | null;
  context?: ThemeContext;
}

export interface ThemeTypography {
  fonts?: {
    body?: string;
    heading?: string;
    mono?: string;
  };
  sizes?: {
    xs?: string;
    sm?: string;
    base?: string;
    md?: string; // Added missing 'md' property
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
  };
  weights?: {
    light?: number;
    normal?: number;
    medium?: number;
    bold?: number;
  };
  lineHeights?: {
    tight?: string;
    normal?: string;
    relaxed?: string;
  };
  letterSpacing?: Record<string, string>;
}

export interface ThemeEffects {
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  blurs?: Record<string, string>;
  gradients?: Record<string, string>;
  glow?: {
    primary?: string;
    secondary?: string;
    hover?: string;
  };
  primary?: string;
  secondary?: string;
  tertiary?: string;
}

export interface ThemeAnimation {
  duration?: {
    fast?: string;
    normal?: string;
    slow?: string;
  };
  curves?: {
    bounce?: string;
    ease?: string;
    spring?: string;
    linear?: string;
  };
  transitions?: Record<string, string>;
  durations?: Record<string, string>;
}

export interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: {
    main?: string;
    overlay?: string;
    card?: string;
    alt?: string;
  };
  text?: {
    primary?: string;
    secondary?: string;
    muted?: string;
    accent?: string;
  };
  borders?: {
    normal?: string;
    hover?: string;
    active?: string;
    focus?: string;
  };
  status?: {
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };
}

export interface ThemeComponents {
  panel?: {
    radius?: string;
    padding?: string;
    background?: string;
  };
  button?: {
    radius?: string;
    padding?: string;
    transition?: string;
  };
  tooltip?: {
    radius?: string;
    padding?: string;
    background?: string;
  };
  input?: {
    radius?: string;
    padding?: string;
    background?: string;
  };
}

export interface DesignTokensStructure {
  colors?: ThemeColors;
  spacing?: Record<string, any>;
  typography?: ThemeTypography;
  effects?: ThemeEffects;
  animation?: ThemeAnimation;
  admin?: Record<string, any>;
  components?: ThemeComponents;
}

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

export interface ThemeContextType {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ComponentTokens[];
  isLoading: boolean;
  error: Error | null;
  setTheme: (themeId: string) => Promise<void>;
}
