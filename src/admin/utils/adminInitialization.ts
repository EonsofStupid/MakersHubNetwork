
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { createDefaultDashboardLayout, createDefaultSidebarLayout, createDefaultTopNavLayout } from './layoutUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Initialize all required admin layouts in the database
 * This ensures the application always has the necessary layouts
 */
export async function initializeAdminLayouts() {
  console.log("Initializing admin layouts...");
  
  try {
    // Check and create dashboard layout
    const dashboardLayout = await layoutSkeletonService.getByTypeAndScope('dashboard', 'admin');
    if (!dashboardLayout.data) {
      console.log("Creating default dashboard layout...");
      await layoutSkeletonService.create({
        name: 'Default Dashboard',
        type: 'dashboard',
        scope: 'admin',
        layout_json: {
          components: createDefaultDashboardLayout(uuidv4()).components,
          version: 1
        },
        is_active: true,
        version: 1
      });
    }
    
    // Check and create sidebar layout
    const sidebarLayout = await layoutSkeletonService.getByTypeAndScope('sidebar', 'admin');
    if (!sidebarLayout.data) {
      console.log("Creating default sidebar layout...");
      await layoutSkeletonService.create({
        name: 'Default Sidebar',
        type: 'sidebar',
        scope: 'admin',
        layout_json: {
          components: createDefaultSidebarLayout(uuidv4()).components,
          version: 1
        },
        is_active: true,
        version: 1
      });
    }
    
    // Check and create topnav layout
    const topNavLayout = await layoutSkeletonService.getByTypeAndScope('topnav', 'admin');
    if (!topNavLayout.data) {
      console.log("Creating default topnav layout...");
      await layoutSkeletonService.create({
        name: 'Default TopNav',
        type: 'topnav',
        scope: 'admin',
        layout_json: {
          components: createDefaultTopNavLayout(uuidv4()).components,
          version: 1
        },
        is_active: true,
        version: 1
      });
    }
    
    console.log("Admin layouts initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing admin layouts:", error);
    return false;
  }
}

/**
 * Initialize admin store with default values
 */
export function getDefaultAdminPreferences() {
  return {
    sidebarExpanded: true,
    showLabels: true,
    topnavItems: [],
    dashboardItems: [],
    isDarkMode: false,
    activeSection: 'overview',
    themePreference: 'cyberpunk',
    layoutPreference: 'default'
  };
}
