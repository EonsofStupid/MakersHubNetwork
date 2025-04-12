
// Theme-related shared types

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
  fallback_value?: string;
}

export interface ComponentTokens {
  id: string;
  component_name: string;
  styles: Record<string, any>;
}

export interface Theme {
  id: string;
  name: string;
  version: string;
  description?: string;
  is_default: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  parent_theme_id?: string;
  cache_key?: string;
  design_tokens: Record<string, any>;
  component_tokens: ComponentTokens[];
  animations?: Record<string, any>;
}
