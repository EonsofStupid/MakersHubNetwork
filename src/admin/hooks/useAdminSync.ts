
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminDataService } from '@/admin/services/adminData.service';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to handle syncing admin data between localStorage and database
 */
export function useAdminSync() {
  const { user } = useAuthStore();
  const adminStore = useAdminStore();
  const { toast } = useToast();

  // Load admin data from database on mount
  useEffect(() => {
    let isMounted = true;

    const loadAdminData = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await AdminDataService.loadPreferences(user.id);
        
        if (error) {
          console.warn('Failed to load admin data:', error);
          return;
        }

        if (data && isMounted) {
          // Format data to match store schema
          const storeData = {
            sidebarExpanded: data.sidebar_expanded ?? true,
            pinnedTopNavItems: data.topnav_items ?? [],
            pinnedDashboardItems: data.dashboard_items ?? [],
            activeSection: data.active_section ?? 'overview',
            isDashboardCollapsed: data.dashboard_collapsed ?? false,
            adminTheme: data.theme_preference ?? 'cyberpunk',
            frozenZones: data.frozen_zones ?? [],
            isDarkMode: data.ui_preferences?.isDarkMode ?? true
          };

          // Update store with database values
          Object.entries(storeData).forEach(([key, value]) => {
            // Only update store if value exists in database
            if (value !== undefined && value !== null) {
              // @ts-ignore - dynamic key access
              adminStore[key] !== value && adminStore.setState({ [key]: value });
            }
          });

          console.log('Admin data loaded from database');
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Sync admin data to database when store changes
  useEffect(() => {
    const saveDataToDatabase = async () => {
      if (!user?.id) return;

      try {
        // Extract store data for database
        const {
          sidebarExpanded,
          pinnedTopNavItems,
          pinnedDashboardItems,
          activeSection,
          isDashboardCollapsed,
          adminTheme,
          frozenZones,
          isDarkMode
        } = adminStore;

        // Format data for database schema
        const dbData = {
          sidebar_expanded: sidebarExpanded,
          topnav_items: pinnedTopNavItems,
          dashboard_items: pinnedDashboardItems,
          active_section: activeSection,
          dashboard_collapsed: isDashboardCollapsed,
          theme_preference: adminTheme,
          frozen_zones: frozenZones,
          ui_preferences: { isDarkMode }
        };

        // Save to database
        const { success, error } = await AdminDataService.savePreferences(user.id, dbData);

        if (!success && error) {
          console.error('Failed to save admin data:', error);
          toast({
            title: "Sync Failed",
            description: "Your preferences couldn't be saved to the cloud",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error saving admin data:', error);
      }
    };

    // Set up store subscription
    const unsubscribe = adminStore.subscribe((state, prevState) => {
      // Check if relevant state has changed
      const keysToCheck = [
        'sidebarExpanded',
        'pinnedTopNavItems',
        'pinnedDashboardItems',
        'activeSection',
        'isDashboardCollapsed',
        'adminTheme',
        'frozenZones',
        'isDarkMode'
      ];

      const hasChanged = keysToCheck.some(key => 
        // @ts-ignore - dynamic key access
        state[key] !== prevState[key]
      );

      if (hasChanged && user?.id) {
        // Debounce save to reduce database calls
        const timeoutId = setTimeout(() => {
          saveDataToDatabase();
        }, 2000);

        return () => clearTimeout(timeoutId);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id, adminStore, toast]);

  return null;
}
