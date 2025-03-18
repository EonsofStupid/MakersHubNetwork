
/**
 * Utility for handling admin routing between legacy and TanStack Router
 */

// Convert a legacy tab path to a TanStack Router path
export const convertLegacyTabToPath = (tab: string): string => {
  return `/admin/${tab}`;
};

// Convert a TanStack Router path to a legacy tab path
export const convertPathToLegacyTab = (path: string): string => {
  // Extract the section after /admin/
  const matches = path.match(/\/admin\/([a-z-]+)/);
  if (matches && matches[1]) {
    return `/admin?tab=${matches[1]}`;
  }
  return '/admin?tab=overview';
};

// Get the current section from a path
export const getSectionFromPath = (path: string): string => {
  const matches = path.match(/\/admin\/([a-z-]+)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  
  // Check for legacy tab
  const url = new URL(path, window.location.origin);
  const tab = url.searchParams.get('tab');
  if (tab) {
    return tab;
  }
  
  return 'overview';
};

// Check if the current URL is using TanStack Router
export const isUsingTanStackRouter = (path: string): boolean => {
  return path.match(/\/admin\/[a-z-]+/) !== null;
};
