
// Theme-related types

export interface Theme {
  id: string;
  name: string;
  description?: string;
  colors: Record<string, string>;
  spacing?: Record<string, string>;
  typography?: {
    fontSizes?: Record<string, string>;
    fontFamilies?: Record<string, string>;
    lineHeights?: Record<string, string>;
    letterSpacing?: Record<string, string>;
  };
  effects?: {
    shadows?: Record<string, string>;
    blurs?: Record<string, string>;
    gradients?: Record<string, string>;
  };
  animations?: {
    keyframes?: Record<string, string>;
    transitions?: Record<string, string>;
    durations?: Record<string, string>;
  };
}

export interface ThemeToken {
  id: string;
  category: string;
  token_name: string;
  token_value: string;
  fallback_value?: string;
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'gradient' | 'animation';
}

export interface ComponentTokens {
  id: string;
  component_name: string;
  styles: Record<string, string>;
  description?: string;
}

export interface ThemeLogDetails {
  theme: string;
  operation: string;
  component?: string;
  details?: Record<string, unknown>;
}
