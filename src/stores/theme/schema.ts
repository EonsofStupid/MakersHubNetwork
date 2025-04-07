
import { z } from 'zod';
import { ThemeContext, ThemeStatus } from '@/types/theme';

// Define component token schema
export const ComponentTokenSchema = z.object({
  id: z.string(),
  component_name: z.string(),
  styles: z.record(z.unknown()),
  description: z.string().optional(),
  theme_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  context: z.enum(['site', 'admin', 'chat', 'app', 'training']).optional()
});

// Define colors schema with specific properties
export const ColorsSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  foreground: z.string().optional(),
  card: z.string().optional(),
  cardForeground: z.string().optional(),
  muted: z.string().optional(),
  mutedForeground: z.string().optional(),
  border: z.string().optional(),
  input: z.string().optional(),
  ring: z.string().optional(),
}).catchall(z.string());

// Define effects schema with specific properties
export const EffectsSchema = z.object({
  shadows: z.record(z.unknown()).optional().default({}),
  blurs: z.record(z.unknown()).optional().default({}),
  gradients: z.record(z.unknown()).optional().default({}),
  primary: z.string().optional(),
  secondary: z.string().optional(),
  tertiary: z.string().optional(),
}).catchall(z.union([z.string(), z.record(z.unknown())]));

// Define design tokens schema
export const DesignTokensSchema = z.object({
  colors: ColorsSchema.optional().default({}),
  spacing: z.record(z.unknown()).optional().default({}),
  typography: z.object({
    fontSizes: z.record(z.unknown()).optional().default({}),
    fontFamilies: z.record(z.unknown()).optional().default({}),
    lineHeights: z.record(z.unknown()).optional().default({}),
    letterSpacing: z.record(z.unknown()).optional().default({}),
  }).optional().default({}),
  effects: EffectsSchema.optional().default({
    shadows: {},
    blurs: {},
    gradients: {}
  }),
  animation: z.object({
    keyframes: z.record(z.unknown()).optional().default({}),
    transitions: z.record(z.unknown()).optional().default({}),
    durations: z.record(z.union([z.string(), z.number()])).optional().default({}),
  }).optional().default({
    keyframes: {},
    transitions: {},
    durations: {}
  }),
  admin: z.record(z.unknown()).optional().default({}),
}).default({});

// Define theme schema
export const ThemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  is_default: z.boolean(),
  created_by: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  published_at: z.string().optional(),
  version: z.number(),
  cache_key: z.string().optional(),
  parent_theme_id: z.string().optional(),
  design_tokens: DesignTokensSchema,
  component_tokens: z.array(ComponentTokenSchema).optional().default([]),
  composition_rules: z.record(z.unknown()).optional().default({}),
  cached_styles: z.record(z.unknown()).optional().default({}),
});

// Define theme tokens schema
export const ThemeTokensSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string().optional(),
  background: z.string(),
  foreground: z.string(),
  card: z.string(),
  cardForeground: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  border: z.string(),
  input: z.string(),
  ring: z.string(),
  effectPrimary: z.string(),
  effectSecondary: z.string(),
  effectTertiary: z.string(),
  transitionFast: z.string(),
  transitionNormal: z.string(),
  transitionSlow: z.string(),
  radiusSm: z.string(),
  radiusMd: z.string(),
  radiusLg: z.string(),
  radiusFull: z.string(),
});

// Export types
export type Theme = z.infer<typeof ThemeSchema>;
export type DesignTokens = z.infer<typeof DesignTokensSchema>;
export type ComponentToken = z.infer<typeof ComponentTokenSchema>;
export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
