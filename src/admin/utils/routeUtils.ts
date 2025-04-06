
import { router } from '@/router';

/**
 * Utility for handling admin routing with TanStack Router
 */

// Get the current section from a path
export const getSectionFromPath = (path: string): string => {
  // Check for path pattern /admin/section
  const matches = path.match(/\/admin\/([a-z-]+)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  
  // Check for search parameters
  const search = router.state.location.search;
  if (search.tab) {
    return search.tab as string;
  }
  
  return 'overview';
};

// Generate a path to an admin section
export const getAdminPath = (section: string): string => {
  return `/admin/${section}`;
};

// Check if path is an admin path
export const isAdminPath = (path: string): boolean => {
  return path.startsWith('/admin');
};
