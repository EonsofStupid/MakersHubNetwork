
import { z } from 'zod';
import { ThemeContext } from './theme';

// Define a Zod schema for ThemeContext to ensure valid values
export const ThemeContextSchema = z.enum(['site', 'admin', 'chat', 'app', 'training']);
export type ThemeContextType = z.infer<typeof ThemeContextSchema>;

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
      return ThemeContextSchema.parse('admin');
    }
    
    if (path.startsWith('/chat')) {
      return ThemeContextSchema.parse('chat');
    }
    
    // Additional mappings for new contexts
    if (path.startsWith('/app')) {
      return ThemeContextSchema.parse('app');
    }
    
    if (path.startsWith('/training')) {
      return ThemeContextSchema.parse('training');
    }
    
    // Default to 'site' for all other routes
    return ThemeContextSchema.parse('site');
  } catch (error) {
    console.error('Error determining theme context for path:', path, error);
    // Fallback to site theme if validation fails
    return 'site';
  }
}

/**
 * Validate that a theme context is valid
 */
export function isValidThemeContext(context: string): context is ThemeContext {
  try {
    ThemeContextSchema.parse(context);
    return true;
  } catch {
    return false;
  }
}
