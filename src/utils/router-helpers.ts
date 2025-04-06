
/**
 * Navigation helper functions for handling TanStack Router type safety issues
 */
import { createRoute } from '@tanstack/react-router';

// Helper function for string-based navigation
export function navigateTo(path: string) {
  // This is a type assertion to handle the TanStack Router type error
  // where it expects only relative paths ('/', '.', '..') but we need absolute paths
  return path as unknown as '/' | '.' | '..';
}

// Helper for creating search params that works with TanStack Router
export function createSearchParams<T extends Record<string, any>>(params: T): T {
  // Return the params as is, but with proper typing for TanStack Router
  return params;
}

// Generate a route helper that returns properly typed "to" objects
export function createTypedRoute(path: string) {
  const route = {
    path,
    to: path as unknown as '/' | '.' | '..'
  };
  return route;
}

// Common routes for easy access
export const ROUTES = {
  HOME: createTypedRoute('/'),
  LOGIN: createTypedRoute('/login'),
  PROFILE: createTypedRoute('/profile'),
  SETTINGS: createTypedRoute('/settings'),
  ADMIN_DASHBOARD: createTypedRoute('/admin/dashboard'),
  CHAT: createTypedRoute('/chat')
};
