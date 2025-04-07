
import { rootRoute, siteRoutes } from './routes/site';
import { adminRoutes } from './routes/admin';
import { chatRoutes } from './routes/chat';
import { ThemeContext } from '@/types/theme';

/**
 * Central registry of all application routes
 * This allows for easier management and discovery of routes across scopes
 */
export const routeRegistry = {
  site: siteRoutes,
  admin: adminRoutes,
  chat: chatRoutes
};

/**
 * Get the appropriate theme context based on the current route path
 */
export function getThemeContextForRoute(path: string): ThemeContext {
  if (path.startsWith('/admin') || path.startsWith('/admin-dashboard')) {
    return 'admin';
  }
  
  if (path.startsWith('/chat')) {
    return 'chat';
  }
  
  // Default to 'site' for all other routes
  return 'site';
}
