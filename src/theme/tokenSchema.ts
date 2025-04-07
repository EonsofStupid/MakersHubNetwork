
import { z } from 'zod';

// Define color schema with strict typing
export const colorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
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
}).strict();

// Define effects schema with strict typing
export const effectsSchema = z.object({
  shadows: z.record(z.unknown()).optional(),
  blurs: z.record(z.unknown()).optional(),
  gradients: z.record(z.unknown()).optional(),
  primary: z.string().optional(),
  secondary: z.string().optional(),
  tertiary: z.string().optional(),
}).strict();

// Define animation schema with strict typing
export const animationSchema = z.object({
  keyframes: z.record(z.unknown()).optional(),
  transitions: z.record(z.unknown()).optional(),
  durations: z.record(z.union([z.string(), z.number()])).optional(),
}).strict();

// Define the full design tokens schema
export const designTokensSchema = z.object({
  colors: colorsSchema.optional().default({}),
  spacing: z.record(z.unknown()).optional(),
  typography: z.object({
    fontSizes: z.record(z.unknown()).optional(),
    fontFamilies: z.record(z.unknown()).optional(),
    lineHeights: z.record(z.unknown()).optional(),
    letterSpacing: z.record(z.unknown()).optional(),
  }).optional(),
  effects: effectsSchema.optional().default({
    shadows: {},
    blurs: {},
    gradients: {}
  }),
  animation: animationSchema.optional().default({}),
  admin: z.record(z.unknown()).optional(),
}).strict();

// Define a stricter theme tokens schema for app use
export const themeTokensSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
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
}).strict();

// Export inferred types
export type ColorsSchema = z.infer<typeof colorsSchema>;
export type EffectsSchema = z.infer<typeof effectsSchema>;
export type AnimationSchema = z.infer<typeof animationSchema>;
export type DesignTokensSchema = z.infer<typeof designTokensSchema>;
export type ThemeTokensSchema = z.infer<typeof themeTokensSchema>;

// Create default token values
export const defaultTokens: ThemeTokensSchema = {
  primary: "#00F0FF",
  secondary: "#FF2D6E",
  accent: "#8B5CF6",
  background: "#080F1E",
  foreground: "#F9FAFB",
  card: "#0E172A",
  cardForeground: "#F9FAFB", 
  muted: "#131D35",
  mutedForeground: "#94A3B8",
  border: "#131D35",
  input: "#131D35",
  ring: "#1E293B",
  effectPrimary: "#00F0FF",
  effectSecondary: "#FF2D6E",
  effectTertiary: "#8B5CF6",
  transitionFast: "150ms",
  transitionNormal: "300ms",
  transitionSlow: "500ms",
  radiusSm: "0.25rem",
  radiusMd: "0.5rem",
  radiusLg: "0.75rem",
  radiusFull: "9999px",
};
