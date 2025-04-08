
import { createSearchParams } from "./router-helpers";

/**
 * Navigate to a specific route
 * @param path The path to navigate to
 * @param options Optional navigation options
 */
export function navigateTo(path: string, options?: { replace?: boolean; state?: Record<string, any> }) {
  if (options?.replace) {
    window.location.replace(path);
  } else {
    window.location.href = path;
  }
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
  return window.location.pathname;
}

/**
 * Get URL search parameters
 */
export function getSearchParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

/**
 * Get a specific search parameter value
 * @param key The search parameter key
 */
export function getSearchParam(key: string) {
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Check if the current route matches a specific path
 * @param path The path to check against
 */
export function isCurrentRoute(path: string) {
  return window.location.pathname === path;
}
