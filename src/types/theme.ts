import { z } from "zod";
import { themeSchema, designTokensSchema, componentTokenSchema } from "@/schemas/theme.schema";

// Export the Zod schemas' inferred types
export type Theme = z.infer<typeof themeSchema>;
export type DesignTokens = z.infer<typeof designTokensSchema>;
export type ComponentTokens = z.infer<typeof componentTokenSchema>;

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