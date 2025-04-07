
/**
 * Navigation helper functions for handling TanStack Router type safety issues
 */
import { router } from '@/router';
import type { AnyRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { RouteScope, navigateToScope } from '@/router/utils/scopedRouting';
import { routeRegistry } from '@/router/routeRegistry';

// Define type for navigation options
interface NavigateOptions {
  replace?: boolean;
  state?: Record<string, any>;
}

// Schema for search parameters
const searchParamsSchema = z.record(z.unknown());

/**
 * Create properly formatted search params for TanStack Router
 */
export function createSearchParams<T extends Record<string, any>>(params: T): Record<string, unknown> {
  return params as Record<string, unknown>;
}

/**
 * Navigate to a specific route
 * @param path The path to navigate to
 * @param options Optional navigation options
 */
export function navigateTo(path: string, options?: NavigateOptions): void {
  router.navigate({
    to: path as any, // Type cast to avoid TanStack Router type issues
    replace: options?.replace,
    state: options?.state
  });
}

/**
 * Navigate to a route with search parameters
 */
export function navigateWithParams(path: string, params: Record<string, any>, options?: NavigateOptions): void {
  router.navigate({
    to: path as any, // Type cast to avoid TanStack Router type issues
    search: params as any, // Changed this line to fix typing issues
    replace: options?.replace,
    state: options?.state
  });
}

/**
 * Navigate within a specific scope (site, admin, chat)
 */
export function navigateWithinScope(scope: RouteScope, path: string, options?: {
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  replace?: boolean;
}): void {
  navigateToScope(scope, path, options);
}

/**
 * Navigate back in the router history
 */
export function navigateBack() {
  window.history.back();
}

/**
 * Get the current route path
 */
export function getCurrentRoute() {
  return router.state.location.pathname;
}

/**
 * Get URL search parameters
 */
export function getSearchParams() {
  return router.state.location.search;
}

/**
 * Get a specific search parameter value
 * @param key The search parameter key
 */
export function getSearchParam(key: string) {
  return router.state.location.search[key];
}

/**
 * Check if the current route matches a specific path
 * @param path The path to check against
 */
export function isCurrentRoute(path: string) {
  return router.state.location.pathname === path;
}

/**
 * Check if the current route is within a specific scope
 */
export function isInScope(scope: RouteScope): boolean {
  const pathname = router.state.location.pathname;
  
  switch (scope) {
    case 'admin':
      return pathname.startsWith('/admin');
    case 'chat':
      return pathname.startsWith('/chat');
    case 'site':
      return !pathname.startsWith('/admin') && !pathname.startsWith('/chat');
    default:
      return false;
  }
}

// Helper function for creating strongly-typed route objects with proper TanStack Router compatibility
export function createTypedRoute(path: string) {
  return {
    path,
    to: path
  };
}

// Common routes for easy access - updated with scope awareness
export const ROUTES = {
  // Site routes
  HOME: createTypedRoute('/'),
  LOGIN: createTypedRoute('/login'),
  PROFILE: createTypedRoute('/profile'),
  SETTINGS: createTypedRoute('/settings'),
  
  // Admin routes
  ADMIN_DASHBOARD: createTypedRoute('/admin/dashboard'),
  ADMIN_USERS: createTypedRoute('/admin/users'),
  ADMIN_PARTS: createTypedRoute('/admin/parts'),
  ADMIN_BUILDS: createTypedRoute('/admin/builds'),
  ADMIN_THEMES: createTypedRoute('/admin/themes'),
  ADMIN_CONTENT: createTypedRoute('/admin/content'),
  ADMIN_SETTINGS: createTypedRoute('/admin/settings'),
  ADMIN_PERMISSIONS: createTypedRoute('/admin/permissions'),
  ADMIN_LOGS: createTypedRoute('/admin/logs'),
  
  // Chat routes
  CHAT: createTypedRoute('/chat'),
  CHAT_SESSION: (sessionId: string) => createTypedRoute(`/chat/session/${sessionId}`),
};
