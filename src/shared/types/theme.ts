
export interface Theme {
  id: string;
  name: string;
  description?: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  is_default?: boolean;
  parent_theme_id?: string;
  design_tokens?: Record<string, any>;
  component_tokens?: Record<string, any>;
  cache_key?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export interface ThemeToken {
  id: string;
  theme_id: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
  fallback_value?: string;
  is_public?: boolean;
}

export interface ComponentTokens {
  id: string;
  component_name: string;
  tokens: Record<string, any>;
}

export interface ThemeEffect {
  type: 'glitch' | 'gradient' | 'cyber' | 'pulse' | 'particle' | 'morph';
  enabled: boolean;
  [key: string]: any;
}

export interface ThemeLogDetails {
  success?: boolean;
  errorMessage?: string;
  theme?: string;
  details?: Record<string, any>;
}
