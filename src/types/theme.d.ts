
export type ThemeStatus = 'draft' | 'published' | 'archived';
export type ThemeContext = 'site' | 'admin' | 'chat' | 'app' | 'training';

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
}

export interface DesignTokensStructure {
  colors?: {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    foreground?: string;
    card?: string;
    cardForeground?: string;
    muted?: string;
    mutedForeground?: string;
    border?: string;
    input?: string;
    ring?: string;
    [key: string]: string | undefined;
  };
  spacing?: Record<string, any>;
  typography?: TypographyTokens;
  effects: {
    shadows: Record<string, any>;
    blurs: Record<string, any>;
    gradients: Record<string, any>;
    primary?: string;
    secondary?: string;
    tertiary?: string;
    [key: string]: string | Record<string, any> | undefined;
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
  context?: ThemeContext;
}

export interface ThemeToken {
  id: string;
  name: string;
  value: string;
  category: string;
  theme_id: string;
}

// Updated to be compatible with logger options
import { LogCategory } from '@/logging';

export interface ThemeLogDetails {
  // Status indicators
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  
  // Error information
  errorMessage?: string;
  errorCode?: string;
  errorDetails?: Record<string, any>;
  errorHint?: string;
  errorName?: string;
  
  // Theme information
  themeId?: string;
  themeName?: string;
  theme?: string;
  defaultTheme?: string;
  originalTheme?: string;
  
  // Component information
  component?: string;
  componentCount?: number;
  componentTokensCount?: number;
  
  // Operation status
  mainSite?: boolean;
  admin?: boolean;
  database?: boolean;
  isFallback?: boolean;
  
  // Additional context
  reason?: string;
  source?: string;
  details?: Record<string, unknown>;
  hasAnimations?: boolean;
  hasComponentStyles?: boolean;
  category?: LogCategory;
  
  // Allow for additional properties
  [key: string]: unknown;
}

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

// Fixed ThemeTokens type for the store
export interface StoreThemeTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  effectPrimary: string;
  effectSecondary: string;
  effectTertiary: string;
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
  [key: string]: string;
}
