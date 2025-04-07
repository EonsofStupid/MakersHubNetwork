
import { z } from 'zod';

// Define the theme context type to ensure consistent usage
export const ThemeContextSchema = z.enum(['site', 'admin', 'chat', 'app', 'training']);
export type ThemeContext = z.infer<typeof ThemeContextSchema>;

// Safe utility for parsing theme contexts
export function parseThemeContext(input: unknown): ThemeContext {
  try {
    return ThemeContextSchema.parse(input);
  } catch (error) {
    // Default to 'app' as fallback
    return 'app';
  }
}
