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
}

export interface ThemeContextType {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ThemeComponent[];
  isLoading: boolean;
  error: Error | null;
  setTheme: (themeId: string) => Promise<void>;
}