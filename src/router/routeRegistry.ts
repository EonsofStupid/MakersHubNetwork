
import { createRootRoute } from '@tanstack/react-router';
import { siteRoutes } from './routes/site';
import { adminRoutes } from './routes/admin';
import { chatRoutes } from './routes/chat';
import { ThemeContext } from '@/types/theme';
import { z } from 'zod';

// Define a Zod schema for ThemeContext to ensure valid values
const ThemeContextSchema = z.enum(['site', 'admin', 'chat', 'app', 'training']);

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
  component: () => <div>Root Route</div>
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
