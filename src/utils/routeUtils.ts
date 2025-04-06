
import { router } from '@/router';

/**
 * Navigate to a specific route
 * @param path The path to navigate to
 * @param options Optional navigation options
 */
export function navigateTo(path: string, options?: { replace?: boolean; search?: Record<string, any> }) {
  router.navigate({
    to: path, 
    replace: options?.replace,
    search: options?.search
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
