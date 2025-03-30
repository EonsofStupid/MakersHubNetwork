
import { useEffect, useState } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminDataService } from '@/admin/services/adminData.service';
import { useAuthStore } from '@/stores/auth/store';

/**
 * Custom hook to sync admin state between local storage and database
 */
export function useAdminSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const adminStore = useAdminStore();
  const { user } = useAuthStore();
  
  // Sync from database on initial load
  useEffect(() => {
    const syncFromDatabase = async () => {
      if (!user?.id) return;
      
      try {
        setIsSyncing(true);
        
        // Load admin preferences from the database
        const { data } = await AdminDataService.loadPreferences(user.id);
        
        if (data) {
          // Update local store with database values
          if (data.pinnedTopNavItems) {
            adminStore.setPinnedTopNavItems(data.pinnedTopNavItems);
          }
          
          if (data.dashboardShortcuts) {
            adminStore.setDashboardShortcuts(data.dashboardShortcuts);
          }
          
          if (data.sidebarExpanded !== undefined) {
            adminStore.setSidebarExpanded(data.sidebarExpanded);
          }
          
          if (data.activeSection) {
            adminStore.setActiveSection(data.activeSection);
          }
        }
        
        setLastSyncTime(new Date());
        adminStore.initializeStore();
        adminStore.resetPreferencesChanged();
      } catch (error) {
        console.error('Error syncing from database:', error);
      } finally {
        setIsSyncing(false);
      }
    };
    
    // Only sync if the user is authenticated and has admin permissions
    if (user?.id && !adminStore.hasInitialized) {
      syncFromDatabase();
    }
  }, [adminStore, user?.id]);

  // Sync to database when preferences change
  useEffect(() => {
    // Debounce to prevent excessive database writes
    let syncTimeout: NodeJS.Timeout | null = null;
    
    const syncToDatabase = async () => {
      if (!adminStore.hasInitialized || !user?.id) return;
      
      try {
        setIsSyncing(true);
        
        // Extract only the relevant data that needs to be synced
        const dataToSync = {
          sidebarExpanded: adminStore.sidebarExpanded,
          pinnedTopNavItems: adminStore.pinnedTopNavItems,
          dashboardShortcuts: adminStore.dashboardShortcuts,
          activeSection: adminStore.activeSection,
        };
        
        // Save to the database
        await AdminDataService.savePreferences(user.id, dataToSync);
        
        setLastSyncTime(new Date());
        adminStore.resetPreferencesChanged();
      } catch (error) {
        console.error('Error syncing to database:', error);
      } finally {
        setIsSyncing(false);
      }
    };
    
    // Set up a debounced sync to database
    if (adminStore.preferencesChanged && user?.id) {
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(syncToDatabase, 1000);
    }
    
    return () => {
      if (syncTimeout) clearTimeout(syncTimeout);
    };
  }, [
    adminStore.sidebarExpanded,
    adminStore.pinnedTopNavItems,
    adminStore.dashboardShortcuts,
    adminStore.activeSection,
    adminStore.hasInitialized,
    adminStore.preferencesChanged,
    adminStore.resetPreferencesChanged,
    user?.id
  ]);
  
  return { isSyncing, lastSyncTime };
}
