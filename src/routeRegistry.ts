
import { createRootRoute } from '@tanstack/react-router';
import { siteRoutes } from './routes/site';
import { adminRoutes } from './routes/admin';
import { chatRoutes } from './routes/chat';
import { ThemeContext } from '@/types/theme';
import RootRouteFallback from '@/components/layouts/RootRouteFallback';

/**
 * Registry of all routes in the application
 */
export const routeRegistry = {
  // Site routes
  site: siteRoutes,
  
  // Admin routes
  admin: adminRoutes,
  
  // Chat routes
  chat: chatRoutes
};

// Create a root route for testing or fallback
export const rootRoute = createRootRoute({
  component: RootRouteFallback
});

/**
 * Get theme context for the current route path
 */
export function getThemeContextForRoute(routePath: string): ThemeContext {
  try {
    if (routePath.startsWith('/admin')) {
      return 'admin';
    } else if (routePath.startsWith('/chat')) {
      return 'chat';
    } else if (routePath.startsWith('/app')) {
      return 'app';
    } else if (routePath.startsWith('/training')) {
      return 'training';
    } else {
      return 'site';
    }
  } catch (error) {
    console.error('Error determining theme context for route:', error);
    return 'site'; // Fallback to site theme
  }
}

/**
 * Validate if a scope string is a valid router scope
 */
export function isValidScope(scope: string): scope is 'site' | 'admin' | 'chat' {
  return ['site', 'admin', 'chat'].includes(scope);
}

/**
 * Map a route path to a theme context
 */
export function mapRouteToThemeContext(path: string): ThemeContext {
  return getThemeContextForRoute(path);
}

/**
 * Check if a path is within a specific scope
 */
export function isPathInScope(path: string, scope: 'site' | 'admin' | 'chat'): boolean {
  switch (scope) {
    case 'admin':
      return path.startsWith('/admin');
    case 'chat':
      return path.startsWith('/chat');
    case 'site':
      return !path.startsWith('/admin') && !path.startsWith('/chat');
    default:
      return false;
  }
}
