
import { z } from 'zod';
import { ThemeContext } from './theme';

// Define a Zod schema for ThemeContext to validate and parse contexts
export const ThemeContextSchema = z.enum(['site', 'admin', 'chat', 'app', 'training']);

/**
 * Parse a string value into a valid ThemeContext
 * @param contextValue Any string that might represent a ThemeContext
 * @returns A valid ThemeContext or defaults to 'app'
 */
export function parseThemeContext(contextValue: string | undefined | null): ThemeContext {
  if (!contextValue) return 'app';
  
  const result = ThemeContextSchema.safeParse(contextValue.toLowerCase());
  
  if (result.success) {
    return result.data;
  }
  
  // Default fallback
  return 'app';
}
