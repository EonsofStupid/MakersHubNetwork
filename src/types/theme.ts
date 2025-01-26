import { Json } from "@/integrations/supabase/types";

export type ThemeStatus = 'draft' | 'published' | 'archived';

interface ThemeTokens {
  colors?: Record<string, Json>;
  spacing?: Record<string, Json>;
  typography?: {
    fontSizes?: Record<string, Json>;
    fontFamilies?: Record<string, Json>;
    lineHeights?: Record<string, Json>;
    letterSpacing?: Record<string, Json>;
  };
  effects?: {
    shadows?: Record<string, Json>;
    blurs?: Record<string, Json>;
    gradients?: Record<string, Json>;
  };
  animations?: {
    keyframes?: Record<string, Json>;
    transitions?: Record<string, Json>;
    durations?: Record<string, Json>;
  };
  [key: string]: Json | undefined;
}

interface ComponentTokens {
  base?: Record<string, Json>;
  variants?: Record<string, Json>;
  states?: Record<string, Json>;
  responsive?: Record<string, Json>;
  darkMode?: Record<string, Json>;
  [key: string]: Json | undefined;
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
  composition_rules: Record<string, Json>;
  cached_styles?: Record<string, Json>;
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
  styles: Record<string, Json>;
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