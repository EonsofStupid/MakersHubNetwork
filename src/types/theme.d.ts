
export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  is_default: boolean;  // Must be a boolean, not optional
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
  context?: 'site' | 'admin' | 'chat';  // Use proper ThemeContext union type
}

export interface ThemeToken {
  id: string;
  name: string;
  value: string;
  category: string;
  theme_id: string;
}

// Add ThemeLogDetails interface to ensure consistency across files
export interface ThemeLogDetails {
  // Status indicators
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  
  // Error information
  errorMessage?: string;
  errorCode?: string;
  errorDetails?: string;
  errorHint?: string;
  
  // Theme information
  themeId?: string;
  theme?: string;
  defaultTheme?: string;
  originalTheme?: string;
  
  // Component information
  component?: string;
  componentCount?: number;
  
  // Operation status
  mainSite?: boolean;
  admin?: boolean;
  database?: boolean;
  
  // Additional context
  reason?: string;
  details?: Record<string, unknown>;
  
  // Allow for additional properties
  [key: string]: unknown;
}

// Define ThemeContext type to ensure consistent usage
export type ThemeContext = 'site' | 'admin' | 'chat';
