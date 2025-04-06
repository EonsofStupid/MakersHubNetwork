
import { z } from "zod";

// Define valid theme contexts
export const ThemeContextSchema = z.enum(['app', 'site', 'admin', 'chat', 'training']);
export type ThemeContext = z.infer<typeof ThemeContextSchema>;

// Color tokens with hex validation
const HexColorSchema = z.string().regex(/^#([0-9a-fA-F]{3,8})$/, "Must be a valid hex color");
const HslColorSchema = z.string(); // HSL color in format like "186 100% 50%"

// Base tokens schema with strong typing
export const ThemeTokensSchema = z.object({
  // Colors
  primary: HslColorSchema,
  secondary: HslColorSchema,
  accent: HslColorSchema,
  background: HslColorSchema,
  foreground: HslColorSchema,
  card: HslColorSchema,
  cardForeground: HslColorSchema,
  muted: HslColorSchema,
  mutedForeground: HslColorSchema,
  border: HslColorSchema,
  input: HslColorSchema,
  ring: HslColorSchema,
  
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

// Animation keyframe schema
export const KeyframeSchema = z.record(z.record(z.string()));

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
  animations: z.record(KeyframeSchema).optional(),
});

// Derived types
export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
export type Theme = z.infer<typeof ThemeSchema>;

// Fallback tokens with default values
export const fallbackTokens: ThemeTokens = {
  // Colors
  primary: "186 100% 50%",
  secondary: "334 100% 59%",
  accent: "262 80% 60%",
  background: "228 47% 8%",
  foreground: "210 40% 98%",
  card: "228 47% 11%",
  cardForeground: "210 40% 98%",
  muted: "228 47% 15%",
  mutedForeground: "215 20.2% 65.1%",
  border: "228 47% 15%",
  input: "228 47% 15%",
  ring: "228 47% 20%",
  
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
