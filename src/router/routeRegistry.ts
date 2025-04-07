
import { siteRoutes } from './routes/site';
import { adminRoutes } from './routes/admin';
import { chatRoutes } from './routes/chat';
import { z } from 'zod';
import { getLogger } from '@/logging';
import { ThemeContext } from '@/types/theme';
import { ThemeContextSchema } from '@/types/themeContext';

const logger = getLogger('RouteRegistry');

/**
 * Central registry of all application routes with their trees and individual routes
 * This allows for easier management and discovery of routes across scopes
 */
export const routeRegistry = (() => {
  try {
    return {
      site: siteRoutes,
      admin: adminRoutes,
      chat: chatRoutes
    };
  } catch (error) {
    logger.error('Failed to initialize route registry', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    // Provide fallback routes to prevent complete app failure
    return {
      site: {
        root: null,
        base: null,
        index: null,
        login: null,
        tree: null
      },
      admin: {
        base: null,
        tree: null
      },
      chat: {
        base: null,
        tree: null
      }
    };
  }
})();

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
  try {
    // Use the Zod schema to validate the output
    if (path.startsWith('/admin')) {
      return ThemeContextSchema.parse('admin');
    }
    
    if (path.startsWith('/chat')) {
      return ThemeContextSchema.parse('chat');
    }
    
    // Default to 'site' for all other routes
    return ThemeContextSchema.parse('site');
  } catch (error) {
    logger.error('Error determining theme context', {
      path,
      error: error instanceof Error ? error.message : String(error)
    });
    // Fallback to site theme if validation fails
    return 'site';
  }
}

/**
 * Check if a path belongs to a specific scope
 */
export function isPathInScope(path: string, scope: 'site' | 'admin' | 'chat'): boolean {
  try {
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
  } catch (error) {
    logger.error('Error checking path scope', {
      path,
      scope,
      error: error instanceof Error ? error.message : String(error)
    });
    return false;
  }
}
