
import { createRootRoute } from '@tanstack/react-router';
import { ThemeContext } from '@/types/theme';
import RootRouteFallback from '@/components/layouts/RootRouteFallback';
import { adminRoutes } from '@/router/routes/admin';
import { chatRoutes } from '@/router/routes/chat';
import { siteRoutes } from '@/router/routes/site';

// Create a root route for testing or fallback
export const rootRoute = createRootRoute({
  component: RootRouteFallback
});

/**
 * Registry of all routes in the application
 * Note: The route registry is initialized during application bootstrap
 */
export const routeRegistry = {
  // Site routes - these are dynamically imported
  site: siteRoutes,
  
  // Admin routes - these are dynamically imported
  admin: adminRoutes,
  
  // Chat routes - these are dynamically imported
  chat: chatRoutes
};

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
