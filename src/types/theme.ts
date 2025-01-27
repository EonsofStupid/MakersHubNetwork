import { z } from "zod";
import { Theme as ThemeSchema, DesignTokens as DesignTokensSchema, ComponentToken as ComponentTokenSchema } from "@/schemas/theme.schema";

// Export the Zod schemas' inferred types
export type Theme = z.infer<typeof ThemeSchema>;
export type DesignTokens = z.infer<typeof DesignTokensSchema>;
export type ComponentTokens = z.infer<typeof ComponentTokenSchema>;

// Theme token specific types
export interface ThemeToken {
  id: string;
  theme_id?: string;
  category: string;
  token_name: string;
  token_value: string;
  fallback_value?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Theme component specific types
export interface ThemeComponent {
  id: string;
  theme_id?: string;
  component_name: string;
  styles: Record<string, any>;
  tokens?: Record<string, any>;
  description?: string;
  created_at?: string;
  updated_at?: string;
  context?: string;
}

// Utility type for theme status
export type ThemeStatus = 'draft' | 'published' | 'archived';

// Database response types
export interface ThemeResponse {
  id: string;
  name: string;
  description?: string;
  status: ThemeStatus;
  is_default: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  version: number;
  parent_theme_id?: string;
  design_tokens: DesignTokens;
  component_tokens: ComponentTokens;
  composition_rules: Record<string, any>;
  cache_key?: string;
  cached_styles: Record<string, any>;
}