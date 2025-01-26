import { Json } from "@/integrations/supabase/types";

export type ThemeStatus = 'draft' | 'published' | 'archived';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface ThemeTokens extends Record<string, Json | undefined> {
  colors?: Record<string, JsonValue>;
  spacing?: Record<string, JsonValue>;
  typography?: {
    fontSizes?: Record<string, JsonValue>;
    fontFamilies?: Record<string, JsonValue>;
    lineHeights?: Record<string, JsonValue>;
    letterSpacing?: Record<string, JsonValue>;
  };
  effects?: {
    shadows?: Record<string, JsonValue>;
    blurs?: Record<string, JsonValue>;
    gradients?: Record<string, JsonValue>;
  };
  animations?: {
    keyframes?: Record<string, JsonValue>;
    transitions?: Record<string, JsonValue>;
    durations?: Record<string, JsonValue>;
  };
}

interface ComponentTokens extends Record<string, Json | undefined> {
  base?: Record<string, JsonValue>;
  variants?: Record<string, JsonValue>;
  states?: Record<string, JsonValue>;
  responsive?: Record<string, JsonValue>;
  darkMode?: Record<string, JsonValue>;
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
  design_tokens: ThemeTokens;
  component_tokens: ComponentTokens;
  composition_rules: Record<string, JsonValue>;
  cached_styles?: Record<string, JsonValue>;
}

export interface ThemeToken {
  id: string;
  theme_id: string;
  category: string;
  token_name: string;
  token_value: string;
  fallback_value?: string;
  description?: string;
}

export interface ThemeComponent {
  id: string;
  theme_id: string;
  component_name: string;
  styles: Record<string, JsonValue>;
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