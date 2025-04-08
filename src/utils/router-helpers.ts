
import { NavigateOptions, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

/**
 * Create properly formatted search params for React Router
 */
export function createSearchParams<T extends Record<string, any>>(params: T): URLSearchParams {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  );
}

/**
 * Navigate to a specific route
 * @param path The path to navigate to
 * @param options Optional navigation options
 */
export function navigateTo(path: string, options?: NavigateOptions): void {
  window.location.href = path;
}

/**
 * Navigate to a route with search parameters
 */
export function navigateWithParams(path: string, params: Record<string, any>, options?: NavigateOptions): void {
  const searchParams = createSearchParams(params);
  const url = `${path}?${searchParams.toString()}`;
  window.location.href = url;
}

/**
 * Navigate within a specific scope (site, admin, chat)
 */
export function navigateWithinScope(scope: 'site' | 'admin' | 'chat', path: string, options?: {
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  replace?: boolean;
}): void {
  // Build the path based on scope
  let fullPath = path;
  if (scope === 'admin' && !path.startsWith('/admin')) {
    fullPath = `/admin${path.startsWith('/') ? path : `/${path}`}`;
  } else if (scope === 'chat' && !path.startsWith('/chat')) {
    fullPath = `/chat${path.startsWith('/') ? path : `/${path}`}`;
  }
  
  // Build search params if needed
  let url = fullPath;
  if (options?.search) {
    const searchParams = createSearchParams(options.search);
    url = `${fullPath}?${searchParams.toString()}`;
  }
  
  // Navigate
  if (options?.replace) {
    window.location.replace(url);
  } else {
    window.location.href = url;
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

/**
 * Check if the current route is within a specific scope
 */
export function isInScope(scope: 'site' | 'admin' | 'chat'): boolean {
  const pathname = window.location.pathname;
  
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

// Common routes for easy access
export const ROUTES = {
  // Site routes
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PARTS: '/admin/parts',
  ADMIN_BUILDS: '/admin/builds',
  ADMIN_THEMES: '/admin/themes',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_PERMISSIONS: '/admin/permissions',
  ADMIN_LOGS: '/admin/logs',
  
  // Chat routes
  CHAT: '/chat',
  CHAT_SESSION: (sessionId: string) => `/chat/session/${sessionId}`,
};

// Hook exports for components
export { useNavigate, useLocation, useSearchParams, useParams };
