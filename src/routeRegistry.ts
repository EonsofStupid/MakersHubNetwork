
import { ThemeContext } from './types/theme';
import { parseThemeContext } from './types/themeContext';

// Map routes to theme contexts
const routeContextMap: Record<string, ThemeContext> = {
  '/': 'site',
  '/admin': 'admin',
  '/chat': 'chat',
};

/**
 * Get the theme context for a given route
 */
export function getThemeContextForRoute(path: string): ThemeContext {
  // First check for exact matches
  if (routeContextMap[path]) {
    return routeContextMap[path];
  }
  
  // Then check for path prefixes
  if (path.startsWith('/admin/')) {
    return 'admin';
  }
  
  if (path.startsWith('/chat/')) {
    return 'chat';
  }
  
  // Default to site for any other routes
  return 'site';
}

/**
 * Check if a path is within a specific scope
 */
export function isPathInScope(path: string, scope: 'site' | 'admin' | 'chat'): boolean {
  const context = getThemeContextForRoute(path);
  return parseThemeContext(context) === scope;
}

/**
 * Register a new route with its theme context
 */
export function registerRouteContext(path: string, context: ThemeContext): void {
  routeContextMap[path] = context;
}
