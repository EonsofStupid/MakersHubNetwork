
import { adminNavigationItems } from '@/admin/config/navigation.config';

// Default admin preferences when a user first accesses the admin section
export function getDefaultAdminPreferences() {
  // Get some sensible default nav shortcuts based on common usage
  const defaultTopNavItems = adminNavigationItems
    .filter(item => ['overview', 'users', 'settings'].includes(item.id))
    .map(item => item.id);
    
  // Get some sensible default dashboard shortcuts based on common usage  
  const defaultDashboardItems = adminNavigationItems
    .filter(item => ['builds', 'content', 'users', 'analytics'].includes(item.id))
    .map(item => item.id);
  
  return {
    sidebarExpanded: true,
    showLabels: true,
    topnavItems: defaultTopNavItems,
    dashboardItems: defaultDashboardItems,
    isDarkMode: false,
    themePreference: 'cyberpunk',
    layoutPreference: 'default',
    activeSection: 'overview'
  };
}

// Initialize admin layouts when the app starts
export function initializeAdminLayouts() {
  // Register admin components
  console.log('Initializing admin layouts...');
  
  // Future implementation for layout creation in database
  return true;
}
