
import { z } from 'zod';

// Define the theme tokens schema with Zod for validation
export const ThemeTokensSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string().optional().default('262 80% 50%'),
  background: z.string(),
  foreground: z.string(),
  card: z.string().optional().default('228 47% 11%'),
  cardForeground: z.string().optional().default('210 40% 98%'),
  muted: z.string().optional().default('228 47% 15%'),
  mutedForeground: z.string().optional().default('215 20% 65%'),
  border: z.string().optional().default('228 47% 15%'),
  input: z.string().optional().default('228 47% 15%'),
  ring: z.string().optional().default('228 47% 20%'),
  effectPrimary: z.string().optional().default('#00F0FF'),
  effectSecondary: z.string().optional().default('#FF2D6E'),
  effectTertiary: z.string().optional().default('#8B5CF6'),
  transitionFast: z.string().optional().default('150ms'),
  transitionNormal: z.string().optional().default('300ms'),
  transitionSlow: z.string().optional().default('500ms'),
  radiusSm: z.string().optional().default('0.25rem'),
  radiusMd: z.string().optional().default('0.5rem'),
  radiusLg: z.string().optional().default('0.75rem'),
  radiusFull: z.string().optional().default('9999px'),
});

// Export the type directly from the schema
export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;

// Default theme tokens to use as fallback
export const defaultTokens: ThemeTokens = {
  primary: "186 100% 50%",
  secondary: "334 100% 59%",
  accent: "262 80% 50%",
  background: "228 47% 8%",
  foreground: "210 40% 98%",
  card: "228 47% 11%",
  cardForeground: "210 40% 98%", 
  muted: "228 47% 15%",
  mutedForeground: "215 20% 65%",
  border: "228 47% 15%",
  input: "228 47% 15%",
  ring: "228 47% 20%",
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
