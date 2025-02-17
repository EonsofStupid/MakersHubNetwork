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

export interface UserPreferences {
  mode: 'dark' | 'light';
  accentColor: string;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large';
}

export interface ThemeState {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ComponentTokens[];
  adminComponents: ComponentTokens[];
  userPreferences: UserPreferences;
  isLoading: boolean;
  error: Error | null;
  setTheme: (themeId: string) => Promise<void>;
  loadAdminComponents: () => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  resetTheme: () => void;
}

export interface ThemeActions {
  setTheme: (themeId: string) => Promise<void>;
  loadAdminComponents: () => Promise<void>;
}

export interface ThemeContextValue {
  currentTheme: Theme | null;
  userPreferences: UserPreferences;
  setTheme: (themeId: string) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  isLoading: boolean;
  error: Error | null;
}

export type ThemeStore = ThemeState & ThemeActions; 