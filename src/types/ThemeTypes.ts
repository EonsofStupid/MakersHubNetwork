
// Theme system types

export interface Theme {
  id: string;
  name: string;
  description?: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  is_default: boolean;
  is_system: boolean;
  parent_theme_id?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  author_id?: string;
  cache_key?: string;
  
  // Theme token data
  design_tokens: DesignTokens;
  component_tokens: ComponentTokens;
  effects?: ThemeEffects;
}

export interface DesignTokens {
  colors: Record<string, string>;
  typography: TypographyTokens;
  spacing: Record<string, string>;
  radii: Record<string, string>;
  shadows: Record<string, string>;
  transitions: Record<string, string>;
  animations: Record<string, string>;
}

export interface TypographyTokens {
  fonts: Record<string, string>;
  fontSizes: Record<string, string>;
  fontWeights: Record<string, string | number>;
  lineHeights: Record<string, string | number>;
  letterSpacing: Record<string, string>;
}

export interface ComponentTokens {
  button?: Record<string, string>;
  input?: Record<string, string>;
  card?: Record<string, string>;
  modal?: Record<string, string>;
  toast?: Record<string, string>;
  navbar?: Record<string, string>;
  footer?: Record<string, string>;
  [key: string]: Record<string, string> | undefined;
}

export interface ThemeEffects {
  hover?: Record<string, ThemeEffect>;
  active?: Record<string, ThemeEffect>;
  focus?: Record<string, ThemeEffect>;
  global?: Record<string, ThemeEffect>;
}

export interface ThemeEffect {
  id: string;
  name: string;
  type: 'glow' | 'shimmer' | 'noise' | 'glitch' | 'wave' | 'scan' | 'gradient';
  config: Record<string, any>;
  target: string; // CSS selector
  animation?: string;
  intensity?: number;
  enabled: boolean;
}

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: 'colors' | 'typography' | 'spacing' | 'radii' | 'shadows' | 'transitions' | 'animations';
  description?: string;
  fallback_value?: string;
}

export interface ThemeLogDetails {
  themeName?: string;
  themeId?: string;
  action?: string;
  tokenName?: string;
  tokenValue?: string;
  errorMessage?: string;
  duration?: number;
}
