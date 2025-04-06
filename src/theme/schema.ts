
import { z } from "zod";

// Define valid theme contexts
export const ThemeContextSchema = z.enum(['app', 'site', 'admin', 'chat', 'training']);
export type ThemeContext = z.infer<typeof ThemeContextSchema>;

// Color tokens with hex validation
const HexColorSchema = z.string().regex(/^#([0-9a-fA-F]{3,8})$/, "Must be a valid hex color");

// Base tokens schema with strong typing
export const ThemeTokensSchema = z.object({
  // Colors
  primary: HexColorSchema,
  secondary: HexColorSchema,
  accent: HexColorSchema,
  background: HexColorSchema,
  foreground: HexColorSchema,
  card: HexColorSchema,
  cardForeground: HexColorSchema,
  muted: HexColorSchema,
  mutedForeground: HexColorSchema,
  border: HexColorSchema,
  input: HexColorSchema,
  ring: HexColorSchema,
  
  // Effects
  effectPrimary: HexColorSchema,
  effectSecondary: HexColorSchema,
  effectTertiary: HexColorSchema,
  
  // Animation timings (in ms)
  transitionFast: z.string(),
  transitionNormal: z.string(),
  transitionSlow: z.string(),
  
  // Radius values
  radiusSm: z.string(),
  radiusMd: z.string(),
  radiusLg: z.string(),
  radiusFull: z.string(),
});

// Complete theme schema
export const ThemeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  context: ThemeContextSchema,
  tokens: ThemeTokensSchema,
  status: z.enum(['draft', 'published', 'archived']),
  isDefault: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  design_tokens: z.record(z.unknown()).optional(),
  component_tokens: z.array(z.record(z.unknown())).optional(),
});

// Derived types
export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
export type Theme = z.infer<typeof ThemeSchema>;

// Fallback tokens with default values
export const fallbackTokens: ThemeTokens = {
  // Colors
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
  
  // Effects
  effectPrimary: "#00F0FF",
  effectSecondary: "#FF2D6E",
  effectTertiary: "#8B5CF6",
  
  // Animation timings
  transitionFast: "150ms",
  transitionNormal: "300ms",
  transitionSlow: "500ms",
  
  // Radius values
  radiusSm: "0.25rem",
  radiusMd: "0.5rem",
  radiusLg: "0.75rem",
  radiusFull: "9999px",
};

// Utility function for theme token validation
export function validateThemeTokens(tokens: unknown): ThemeTokens {
  try {
    return ThemeTokensSchema.parse(tokens);
  } catch (error) {
    console.error("Theme validation failed:", error);
    return fallbackTokens;
  }
}
