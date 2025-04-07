
import { z } from 'zod';

// Define the theme tokens schema with Zod
export const ThemeTokensSchema = z.object({
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
});

// Type for theme tokens
export type ThemeTokensSchema = z.infer<typeof ThemeTokensSchema>;

// Default theme tokens
export const defaultTokens: ThemeTokensSchema = {
  primary: '186 100% 50%',
  secondary: '334 100% 59%',
  accent: '262 80% 50%',
  background: '228 47% 8%',
  foreground: '210 40% 98%',
  card: '228 47% 11%',
  cardForeground: '210 40% 98%',
  muted: '228 47% 15%',
  mutedForeground: '215 20.2% 65.1%',
  border: '228 47% 15%',
  input: '228 47% 15%',
  ring: '228 47% 15%',
  effectPrimary: '#00F0FF',
  effectSecondary: '#FF2D6E',
  effectTertiary: '#8B5CF6',
  transitionFast: '150ms',
  transitionNormal: '300ms',
  transitionSlow: '500ms',
  radiusSm: '0.25rem',
  radiusMd: '0.5rem',
  radiusLg: '0.75rem',
  radiusFull: '9999px',
};

// Define effects schema
export const ThemeEffectsSchema = z.object({
  shadows: z.record(z.string()).optional(),
  blurs: z.record(z.string()).optional(),
  gradients: z.record(z.string()).optional(),
  primary: z.string().optional(),
  secondary: z.string().optional(),
  tertiary: z.string().optional(),
});

// Define design tokens structure with Zod for validation
export const DesignTokensStructureSchema = z.object({
  colors: z.object({
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
  }).optional(),
  spacing: z.record(z.string()).optional(),
  typography: z.object({
    fontSizes: z.record(z.string()).optional(),
    fontFamilies: z.record(z.string()).optional(),
    lineHeights: z.record(z.string()).optional(),
    letterSpacing: z.record(z.string()).optional(),
  }).optional(),
  effects: ThemeEffectsSchema,
  animation: z.object({
    keyframes: z.record(z.any()).optional(),
    transitions: z.record(z.string()).optional(),
    durations: z.record(z.union([z.string(), z.number()])).optional(),
  }).optional(),
  admin: z.record(z.any()).optional(),
});

// Export types for the schemas
export type DesignTokensStructure = z.infer<typeof DesignTokensStructureSchema>;
export type ThemeEffects = z.infer<typeof ThemeEffectsSchema>;
