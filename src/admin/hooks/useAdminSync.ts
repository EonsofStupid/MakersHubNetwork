
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { useAdminStore, subscribeWithSelector } from '@/admin/store/admin.store';
import { AdminDataService } from '@/admin/services/adminData.service';
import { useToast } from '@/hooks/use-toast';
import { useSharedStore } from '@/stores/shared/store';
import { AdminState } from '@/admin/store/admin.store';

export const SYNC_ID = 'admin-sync';

/**
 * Hook to sync admin UI preferences with Supabase
 */
export function useAdminSync() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { setLoading, clearLoading, setError, clearError } = useSharedStore();
  const adminStore = useAdminStore();

  // Initial load from DB to Zustand
  useEffect(() => {
    let isMounted = true;

    const loadAdminData = async () => {
      if (!user?.id) return;

      try {
        setLoading(SYNC_ID, { isLoading: true, message: 'Loading preferences...' });
        const { data, error } = await AdminDataService.loadPreferences(user.id);

        if (error) {
          console.warn('Failed to load admin data:', error);
          setError(SYNC_ID, { message: `Failed to load preferences: ${error}` });
          return;
        }

        if (data && isMounted) {
          const storeData = {
            sidebarExpanded: data.sidebar_expanded ?? true,
            pinnedTopNavItems: data.topnav_items ?? [],
            pinnedDashboardItems: data.dashboard_items ?? [],
            activeSection: data.active_section ?? 'overview',
            isDashboardCollapsed: data.dashboard_collapsed ?? false,
            adminTheme: data.theme_preference ?? 'cyberpunk',
            frozenZones: data.frozen_zones ?? [],
            isDarkMode: data.ui_preferences?.isDarkMode ?? true,
          };

          Object.entries(storeData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              // @ts-expect-error dynamic key
              if (adminStore[key] !== value) adminStore.setState({ [key]: value });
            }
          });

          clearError(SYNC_ID);
          console.log('Admin preferences loaded from DB');
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        setError(SYNC_ID, { message: `Error loading admin data: ${error}` });
      } finally {
        clearLoading(SYNC_ID);
      }
    };

    loadAdminData();

    return () => {
      isMounted = false;
      clearLoading(SYNC_ID);
    };
  }, [user?.id]);

  // Sync Zustand to DB on change
  useEffect(() => {
    if (!user?.id) return;

    const keysToSync: (keyof AdminState)[] = [
      'sidebarExpanded',
      'pinnedTopNavItems',
      'pinnedDashboardItems',
      'activeSection',
      'isDashboardCollapsed',
      'adminTheme',
      'frozenZones',
      'isDarkMode',
    ];

    const unsubscribe = subscribeWithSelector(
      useAdminStore,
      (state) => keysToSync.reduce((acc, key) => {
        acc[key] = state[key];
        return acc;
      }, {} as Pick<AdminState, typeof keysToSync[number]>),
      async (state, prevState) => {
        const changed = keysToSync.some((key) => state[key] !== prevState[key]);
        if (!changed) return;

        try {
          setLoading(SYNC_ID, { isLoading: true, message: 'Saving preferences...' });

          const dbData = {
            sidebar_expanded: state.sidebarExpanded,
            topnav_items: state.pinnedTopNavItems,
            dashboard_items: state.pinnedDashboardItems,
            active_section: state.activeSection,
            dashboard_collapsed: state.isDashboardCollapsed,
            theme_preference: state.adminTheme,
            frozen_zones: state.frozenZones,
            ui_preferences: { isDarkMode: state.isDarkMode },
          };

          const { success, error } = await AdminDataService.savePreferences(user.id, dbData);

          if (!success && error) {
            console.error('Failed to save admin data:', error);
            setError(SYNC_ID, { message: `Failed to save preferences: ${error}` });

            toast({
              title: 'Sync Failed',
              description: "Your preferences couldn't be saved to the cloud",
              variant: 'destructive',
            });
          } else {
            clearError(SYNC_ID);
          }
        } catch (error) {
          console.error('Error saving admin data:', error);
          setError(SYNC_ID, { message: `Error saving admin data: ${error}` });
        } finally {
          clearLoading(SYNC_ID);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.id, toast, setLoading, clearLoading, setError, clearError]);
}
