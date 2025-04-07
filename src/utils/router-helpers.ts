
/**
 * Navigation helper functions for handling TanStack Router type safety issues
 */
import { router } from '@/router';
import type { AnyRoute } from '@tanstack/react-router';
import { z } from 'zod';

// Define type for navigation options
interface NavigateOptions {
  replace?: boolean;
  state?: Record<string, any>;
}

// Schema for search parameters
const searchParamsSchema = z.record(z.unknown());

/**
 * Navigate to a specific route
 * @param path The path to navigate to
 * @param options Optional navigation options
 */
export function navigateTo(path: string, options?: NavigateOptions) {
  router.navigate({
    to: path as any, 
    replace: options?.replace,
    // Handle state properly for TanStack Router
    state: options?.state ? options.state : undefined
  });
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

// Helper function for creating strongly-typed route objects with proper TanStack Router compatibility
export function createTypedRoute(path: string) {
  return {
    path,
    to: path as any // Type assertion to make TanStack Router happy
  };
}

// Helper to create search params that are compatible with TanStack Router
export function createSearchParams<T extends Record<string, any>>(params: T): Record<string, unknown> {
  return params as Record<string, unknown>;
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
