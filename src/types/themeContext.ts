
import { z } from 'zod';

// Define valid theme contexts as a union type
export const ThemeContextValues = ['site', 'admin', 'chat', 'app', 'training'] as const;
export type ThemeContext = typeof ThemeContextValues[number];

// Create a Zod schema for ThemeContext validation
export const ThemeContextSchema = z.enum(ThemeContextValues);

/**
 * Get the default theme context for a specific scope
 */
export function getDefaultThemeContext(scope: 'site' | 'admin' | 'chat'): ThemeContext {
  switch (scope) {
    case 'admin':
      return 'admin';
    case 'chat':
      return 'chat';
    case 'site':
    default:
      return 'site';
  }
}

/**
 * Get the appropriate theme context based on a route path
 */
export function getThemeContextForPath(path: string): ThemeContext {
  try {
    if (path.startsWith('/admin')) {
      return 'admin';
    }
    
    if (path.startsWith('/chat')) {
      return 'chat';
    }
    
    // Additional mappings for new contexts
    if (path.startsWith('/app')) {
      return 'app';
    }
    
    if (path.startsWith('/training')) {
      return 'training';
    }
    
    // Default to 'site' for all other routes
    return 'site';
  } catch (error) {
    console.error('Error determining theme context for path:', path, error);
    // Fallback to site theme if validation fails
    return 'site';
  }
}

/**
 * Validate that a theme context is valid
 */
export function isValidThemeContext(context: unknown): context is ThemeContext {
  return typeof context === 'string' && ThemeContextValues.includes(context as ThemeContext);
}
