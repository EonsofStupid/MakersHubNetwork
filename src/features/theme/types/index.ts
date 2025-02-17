export interface Theme {
  id: string;
  name: string;
  description: string;
  is_default: boolean;
  design_tokens: Record<string, any>;
  component_tokens: ComponentTokens[];
  composition_rules: Record<string, any>;
  cached_styles: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ComponentTokens {
  id: string;
  component_name: string;
  styles: Record<string, any>;
  description?: string;
  theme_id: string;
  context?: 'app' | 'admin' | 'shared';
  created_at: string;
  updated_at: string;
}

export interface ThemeToken {
  id: string;
  name: string;
  value: string | number | Record<string, any>;
  category: 'color' | 'typography' | 'spacing' | 'animation' | 'custom';
  scope: 'global' | 'component' | 'context';
  theme_id: string;
}

export interface ThemePreference {
  mode: 'dark' | 'light' | 'system';
  accentColor: string;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface ThemeContextValue {
  currentTheme: Theme | null;
  themePreference: ThemePreference;
  setTheme: (themeId: string) => Promise<void>;
  updatePreference: (updates: Partial<ThemePreference>) => void;
  isLoading: boolean;
  error: Error | null;
} 