
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

// Generate a route object for the admin router
export const getAdminRoute = (section: string): {
  path: string;
  displayName: string;
} => {
  return {
    path: `/admin/${section}`,
    displayName: section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ')
  };
};

// Safely navigate to an admin route
export const navigateToAdminRoute = (router: any, section: string): void => {
  try {
    const path = `/admin/${section}`;
    router.navigate({ to: path });
  } catch (error) {
    console.error("Admin navigation error:", error);
    
    // Fallback to direct navigation
    window.location.href = `/admin/${section}`;
  }
};
