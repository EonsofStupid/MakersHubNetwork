import { Json } from "@/integrations/supabase/types";

export type ThemeStatus = 'draft' | 'published' | 'archived';

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
  design_tokens: Record<string, any>;
  component_tokens: Record<string, any>;
  composition_rules: Record<string, any>;
  cached_styles?: Record<string, any>;
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