
/**
 * Navigation helper functions for handling TanStack Router type safety issues
 */

// Helper function for string-based navigation
export function navigateTo(path: string) {
  // This is a type assertion to handle the TanStack Router type error
  // where it expects only relative paths ('/', '.', '..') but we need absolute paths
  return path as unknown as '/' | '.' | '..';
}

// Helper function for search params
export function createSearchParams(params: Record<string, any>) {
  // This is a type assertion to handle TanStack Router search params type issues
  return params as any;
}
