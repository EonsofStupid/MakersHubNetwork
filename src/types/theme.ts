import { Json } from "@/integrations/supabase/types";

export type ThemeStatus = 'draft' | 'published' | 'archived';

interface DesignTokens {
  colors: Record<string, any>;
  spacing: Record<string, any>;
  typography: {
    fontSizes: Record<string, any>;
    fontFamilies: Record<string, any>;
    lineHeights: Record<string, any>;
    letterSpacing: Record<string, any>;
  };
  effects: {
    shadows: Record<string, any>;
    blurs: Record<string, any>;
    gradients: Record<string, any>;
  };
  animations: {
    keyframes: Record<string, any>;
    transitions: Record<string, any>;
    durations: Record<string, any>;
  };
}

interface ComponentTokens {
  base: Record<string, any>;
  variants: Record<string, any>;
  states: Record<string, any>;
  responsive: Record<string, any>;
  darkMode: Record<string, any>;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: ThemeStatus;
  is_default: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  version: number;
  cache_key?: string;
  parent_theme_id?: string;
  design_tokens: DesignTokens;
  component_tokens: ComponentTokens;
  composition_rules: Record<string, any>;
  cached_styles?: Record<string, any>;
}

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category?: string;
  description?: string;
  fallback_value?: string;
}

export interface ThemeComponent {
  id: string;
  theme_id: string;
  component_name: string;
  styles: Record<string, any>;
  context?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ThemeContextType {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ThemeComponent[];
  isLoading: boolean;
  error: Error | null;
  setTheme: (themeId: string) => Promise<void>;
}

export interface DesignTokens {
  [key: string]: string | number | Record<string, any>;
}

export interface ComponentTokens {
  id: string;
  component_name: string;
  tokens: Record<string, any>;
  description?: string;
}

export interface Theme {
  id: string;
  name: string;
  version: string;
  description?: string;
  status: string;
  is_default: boolean;
  cache_key?: string;
  parent_theme_id?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  design_tokens: DesignTokens;
  component_tokens: ComponentTokens[];
}