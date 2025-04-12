
// Theme token types
export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  fallback_value?: string;
  description?: string;
}

// Design tokens are a collection of theme tokens by category
export interface DesignTokens {
  [category: string]: Record<string, string>;
}

// Component tokens are specific styles for components
export interface ComponentTokens {
  [key: string]: Record<string, string>;
}

// Theme state interface
export interface ThemeState {
  themes: Theme[];
  activeTheme: string;
  componentTokens: ComponentTokens;
  designTokens: DesignTokens;
  isLoading: boolean;
}

// Theme interface
export interface Theme {
  id: string;
  name: string;
  description?: string;
  parent_theme_id?: string;
  is_system?: boolean;
  is_default?: boolean;
  status?: string;
  version?: number;
  context?: string;
  preview_url?: string;
}

// Theme log details
export interface ThemeLogDetails {
  themeId?: string;
  operation?: string;
  component?: string;
  tokenCount?: number;
  duration?: number;
}

// Theme variables
export interface ThemeVariables {
  [key: string]: string;
}
