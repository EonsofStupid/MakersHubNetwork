
import { Json } from "@/integrations/supabase/types";

// Define the theme status type
export type ThemeStatus = 'draft' | 'published' | 'archived';

// Define the theme context type to ensure consistent usage
export type ThemeContext = 'site' | 'admin' | 'chat' | 'app' | 'training';

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
  created_at?: string;
  updated_at?: string;
  context?: ThemeContext;
}

export interface DesignTokensStructure {
  colors?: Record<string, any>;
  spacing?: Record<string, any>;
  typography?: {
    fontSizes?: Record<string, any>;
    fontFamilies?: Record<string, any>;
    lineHeights?: Record<string, any>;
    letterSpacing?: Record<string, any>;
  };
  effects?: {
    shadows?: Record<string, any>;
    blurs?: Record<string, any>;
    gradients?: Record<string, any>;
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  animation?: {
    keyframes?: Record<string, any>;
    transitions?: Record<string, any>;
    durations?: Record<string, any>;
  };
  admin?: Record<string, any>;
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
}

// Comprehensive ThemeLogDetails interface with all possible properties
export interface ThemeLogDetails {
  // Status indicators
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  
  // Error information
  errorMessage?: string;
  errorCode?: string;
  errorDetails?: unknown;
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
  details?: Record<string, unknown>;
  hasAnimations?: boolean;
  hasComponentStyles?: boolean;
  source?: string;
  
  // Allow for additional properties
  [key: string]: unknown;
}

export interface ThemeContextType {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ComponentTokens[];
  isLoading: boolean;
  error: Error | null;
  setTheme: (themeId: string) => Promise<void>;
}
