
export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
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
}

export interface DesignTokensStructure {
  colors?: Record<string, string>;
  spacing?: Record<string, any>;
  typography?: TypographyTokens;
  effects: {
    shadows: Record<string, any>;
    blurs: Record<string, any>;
    gradients: Record<string, any>;
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  animation?: AnimationTokens;
  admin?: Record<string, any>;
}

export interface TypographyTokens {
  fontSizes?: Record<string, any>;
  fontFamilies?: Record<string, any>;
  lineHeights?: Record<string, any>;
  letterSpacing?: Record<string, any>;
}

export interface AnimationTokens {
  keyframes?: Record<string, any>;
  transitions?: Record<string, any>;
  durations?: Record<string, string | number>;
}

export interface ComponentTokens {
  id: string;
  component_name: string;
  styles: Record<string, any>;
  description?: string;
  theme_id?: string;
  created_at?: string;
  updated_at?: string;
  context?: 'site' | 'admin' | 'chat';
}

export interface ThemeToken {
  id: string;
  name: string;
  value: string;
  category: string;
  theme_id: string;
}

export interface ThemeLogDetails {
  error?: boolean;
  success?: boolean;
  warning?: boolean;
  errorMessage?: string;
  errorDetails?: Record<string, any>;
  errorCode?: string;
  errorHint?: string;
  themeId?: string;
  themeName?: string;
  theme?: string;
  isFallback?: boolean;
  originalTheme?: string;
  hasAnimations?: boolean;
  hasComponentStyles?: boolean;
  componentTokensCount?: number;
  mainSite?: boolean;
  admin?: boolean;
  database?: boolean;
  details?: Record<string, unknown>;
  // Added for the TypeScript errors
  errorName?: string;
  reason?: string;
  source?: string;
  component?: string;
}

export type ThemeContext = 'site' | 'admin' | 'chat';

export interface ThemeAnimation {
  name: string;
  duration: string | number;
  timingFunction: string;
  delay?: string | number;
  iterationCount?: string | number;
  direction?: string;
  fillMode?: string;
  keyframes: Record<string, any>;
}

export interface ThemeEffect {
  id: string;
  type: 'glitch' | 'gradient' | 'cyber' | 'pulse' | 'particle' | 'morph';
  enabled: boolean;
  [key: string]: any; // Allow for type-specific properties
}
