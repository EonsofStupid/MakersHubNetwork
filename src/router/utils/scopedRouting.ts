
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '@/types/theme';

// Type for scope
export type RouteScope = 'site' | 'admin' | 'chat';

// Shape of route definition with scope-aware params
export interface ScopedRouteDefinition<
  TParams extends z.ZodTypeAny = z.ZodUndefined,
  TSearch extends z.ZodTypeAny = z.ZodUndefined
> {
  path: string;
  scope: RouteScope;
  params?: TParams;
  search?: TSearch;
}

/**
 * Create a scoped route with type-safe params and search validation
 */
export function defineScopedRoute<
  TParams extends z.ZodTypeAny,
  TSearch extends z.ZodTypeAny = z.ZodUndefined
>(
  path: string,
  scope: RouteScope,
  params?: TParams,
  search?: TSearch
): ScopedRouteDefinition<TParams, TSearch> {
  return {
    path,
    scope,
    params,
    search
  };
}

/**
 * Get the current scope from the router context
 */
export function useCurrentScope(): RouteScope {
  const location = useLocation();
  const pathname = location.pathname;
  
  if (pathname.startsWith('/admin')) {
    return 'admin';
  } else if (pathname.startsWith('/chat')) {
    return 'chat';
  }
  
  return 'site';
}

/**
 * Get the theme context for the current route
 */
export function useThemeContextForRoute(): ThemeContext {
  const location = useLocation();
  const pathname = location.pathname;
  
  if (pathname.startsWith('/admin')) {
    return 'admin';
  } else if (pathname.startsWith('/chat')) {
    return 'chat';
  }
  
  return 'site';
}

/**
 * Navigate to a route within a specific scope
 */
export function navigateToScope(scope: RouteScope, path: string, options?: {
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  replace?: boolean;
}) {
  const navigate = useNavigate();
  const { replace } = options || {};
  
  // Construct the full path with scope prefix if needed
  let fullPath = path;
  if (scope === 'admin' && !path.startsWith('/admin')) {
    fullPath = `/admin${path.startsWith('/') ? path : `/${path}`}`;
  } else if (scope === 'chat' && !path.startsWith('/chat')) {
    fullPath = `/chat${path.startsWith('/') ? path : `/${path}`}`;
  }
  
  // Navigate using the router with correct type assertions
  navigate(fullPath, { replace });
}
