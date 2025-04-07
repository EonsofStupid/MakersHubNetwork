
import { siteRoutes } from './routes/site';
import { adminRoutes } from './routes/admin';
import { chatRoutes } from './routes/chat';
import { ThemeContext } from '@/types/theme';
import { z } from 'zod';

/**
 * Central registry of all application routes with their trees and individual routes
 * This allows for easier management and discovery of routes across scopes
 */
export const routeRegistry = {
  site: siteRoutes,
  admin: adminRoutes,
  chat: chatRoutes
};

// Zod schema for route params by scope
export const routeParamsSchema = {
  chat: {
    session: z.object({
      sessionId: z.string()
    })
  },
  admin: {
    // Add schemas for admin routes with params as needed
  },
  site: {
    // Add schemas for site routes with params as needed
  }
};

/**
 * Get the appropriate theme context based on the current route path
 */
export function getThemeContextForRoute(path: string): ThemeContext {
  if (path.startsWith('/admin')) {
    return 'admin';
  }
  
  if (path.startsWith('/chat')) {
    return 'chat';
  }
  
  // Default to 'site' for all other routes
  return 'site';
}

/**
 * Check if a path belongs to a specific scope
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
