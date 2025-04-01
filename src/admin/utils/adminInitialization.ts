
/**
 * Provides default admin preferences
 */
export function getDefaultAdminPreferences() {
  return {
    sidebarExpanded: true,
    showLabels: true,
    isDarkMode: false,
    topnavItems: [],
    dashboardItems: [],
    themePreference: 'cyberpunk',
    layoutPreference: 'default',
    activeSection: 'overview'
  };
}

/**
 * Validates admin permissions format
 */
export function validatePermissionFormat(permission: string): boolean {
  // Permission format should be action:subject (e.g., "view:users")
  return /^[a-z_]+:[a-z_]+$/.test(permission) || permission === 'all:all';
}

/**
 * Checks if a user's role grants admin access
 */
export function roleGrantsAdminAccess(role: string): boolean {
  return role === 'admin' || role === 'super_admin';
}
