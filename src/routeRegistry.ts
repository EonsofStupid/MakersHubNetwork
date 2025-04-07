import { ThemeContext } from './types/theme';
import { parseThemeContext } from './types/themeContext';

const routeScopes: Record<string, string> = {
  '/admin': 'admin',
  '/chat': 'chat'
};

const routeThemeContexts: Record<string, ThemeContext> = {
  '/admin': 'admin',
  '/chat': 'chat',
  '/': 'site'
};

/**
 * Determine if a path belongs to a specific scope
 * @param path The current route path
 * @param scope The scope to check against
 * @returns boolean indicating if the path is in the specified scope
 */
export function isPathInScope(path: string, scope: string): boolean {
  if (!path) return false;
  
  // Check if the path matches a route directly
  if (path === '/' && scope === 'site') return true;
  
  // Otherwise check if the path starts with the scope
  return path.startsWith(`/${scope}`);
}

/**
 * Get the theme context for a route path
 * @param path The current route path
 * @returns The corresponding theme context for the path
 */
export function getThemeContextForRoute(path: string): ThemeContext {
  if (!path) return 'site';
  
  // Check exact path matches
  if (routeThemeContexts[path]) {
    return routeThemeContexts[path];
  }
  
  // Check for path prefixes
  for (const [routePrefix, context] of Object.entries(routeScopes)) {
    if (path.startsWith(routePrefix)) {
      return parseThemeContext(context);
    }
  }
  
  // Default context
  return 'site';
}

export default {
  isPathInScope,
  getThemeContextForRoute
};
