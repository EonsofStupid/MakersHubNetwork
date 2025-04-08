
/**
 * Utility for handling admin routing with React Router
 */

// Get the current section from a path
export const getSectionFromPath = (path: string): string => {
  // Check for path pattern /admin/section
  const matches = path.match(/\/admin\/([a-z-]+)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  
  // Check for search parameters
  const search = new URLSearchParams(window.location.search);
  const tab = search.get('tab');
  if (tab) {
    return tab;
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
