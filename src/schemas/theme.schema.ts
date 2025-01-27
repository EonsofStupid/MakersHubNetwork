import { z } from "zod";

// Base schemas for nested structures
const typographySchema = z.object({
  fontSizes: z.record(z.string()).default({}),
  fontFamilies: z.record(z.string()).default({}),
  lineHeights: z.record(z.string()).default({}),
  letterSpacing: z.record(z.string()).default({}),
});

const effectsSchema = z.object({
  shadows: z.record(z.string()).default({}),
  blurs: z.record(z.string()).default({}),
  gradients: z.record(z.string()).default({}),
});

const animationsSchema = z.object({
  keyframes: z.record(z.any()).default({}),
  transitions: z.record(z.string()).default({}),
  durations: z.record(z.string()).default({}),
});

// Design tokens schema
export const designTokensSchema = z.object({
  colors: z.record(z.string()).default({}),
  spacing: z.record(z.string()).default({}),
  typography: typographySchema.default({}),
  effects: effectsSchema.default({}),
  animations: animationsSchema.default({}),
});

// Component token schema
export const componentTokenSchema = z.object({
  id: z.string(),
  component_name: z.string(),
  theme_id: z.string().optional(),
  styles: z.record(z.any()).default({}),
  tokens: z.record(z.any()).optional().default({}),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  context: z.string().optional(),
});

// Theme schema
export const themeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  is_default: z.boolean().default(false),
  created_by: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  published_at: z.string().optional(),
  version: z.number(),
  cache_key: z.string().optional(),
  parent_theme_id: z.string().optional(),
  design_tokens: designTokensSchema,
  component_tokens: z.array(componentTokenSchema),
  composition_rules: z.record(z.any()).default({}),
  cached_styles: z.record(z.any()).default({}),
});

export type Theme = z.infer<typeof themeSchema>;
export type DesignTokens = z.infer<typeof designTokensSchema>;
export type ComponentToken = z.infer<typeof componentTokenSchema>;