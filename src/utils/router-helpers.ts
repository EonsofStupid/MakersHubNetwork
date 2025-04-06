
/**
 * Navigation helper functions for handling TanStack Router type safety issues
 */
import { createRoute, Navigate } from '@tanstack/react-router';
import type { AnyRoute, RoutePaths } from '@tanstack/react-router';

// Helper function for string-based navigation
export function navigateTo(path: string) {
  // This is a type assertion to handle the TanStack Router type error
  return path as unknown as '/' | '.' | '..';
}

// Create typed search params helper
export function createSearchParams<T extends Record<string, any>>(params: T): T {
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

// Helper to safely create search params for navigation
export function createRouteParams<T extends Record<string, any>>(params: T): Record<string, unknown> {
  return params as Record<string, unknown>;
}
