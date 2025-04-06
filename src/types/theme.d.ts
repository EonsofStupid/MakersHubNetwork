
import { JsonValue } from "type-fest";

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  token_type: string;
  category: string;
  theme_id?: string;
  description?: string;
  fallback_value?: string;
  name?: string;
  value?: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  is_default: boolean;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  version: string; // Store as string to avoid type conversion issues
  design_tokens?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      foreground?: string;
      accent?: string;
      [key: string]: string | undefined;
    };
    typography?: {
      fontFamily?: string;
      fontSize?: Record<string, string>;
      lineHeight?: Record<string, string>;
      fontWeight?: Record<string, number | string>;
      [key: string]: any;
    };
    spacing?: Record<string, string>;
    breakpoints?: Record<string, string>;
    animation?: {
      durations?: Record<string, string>;
      easings?: Record<string, string>;
      keyframes?: Record<string, any>;
    };
    effects?: Record<string, any>;
    [key: string]: any;
  };
  component_tokens: {
    id: string;
    component_name: string;
    styles: Record<string, any>;
    variables?: Record<string, string>;
    states?: Record<string, any>;
    variants?: Record<string, any>;
    theme_id?: string;
  }[];
  cached_styles?: any;
  context: "site" | "admin" | "chat";
}

export interface ThemeUpdate {
  name?: string;
  description?: string;
  status?: "draft" | "published" | "archived";
  is_default?: boolean;
  design_tokens?: Record<string, any>;
  component_tokens?: Theme["component_tokens"];
  published_at?: string | null;
  updated_at?: string;
}

export interface ThemeLogDetails {
  theme?: string;
  originalTheme?: string;
  errorMessage?: string;
  details?: Record<string, any>;
  success?: boolean;
  error?: boolean;
}
