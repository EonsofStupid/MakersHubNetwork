
import { useEffect, useState } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';

/**
 * Custom hook to sync admin state between local storage and database
 */
export function useAdminSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const adminStore = useAdminStore();

  // Sync from database on initial load
  useEffect(() => {
    const syncFromDatabase = async () => {
      try {
        setIsSyncing(true);
        
        // Here we would fetch admin preferences from the database
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // If there's no database data yet, we would initialize with defaults
        // which are already set in the store
        
        setLastSyncTime(new Date());
      } catch (error) {
        console.error('Error syncing from database:', error);
      } finally {
        setIsSyncing(false);
      }
    };
    
    // Only sync if the user is authenticated and has admin permissions
    if (adminStore.hasInitialized) {
      syncFromDatabase();
    }
  }, [adminStore.hasInitialized]);

  // Sync to database when preferences change
  useEffect(() => {
    // Debounce to prevent excessive database writes
    let syncTimeout: NodeJS.Timeout;
    
    const syncToDatabase = async () => {
      if (!adminStore.hasInitialized) return;
      
      try {
        setIsSyncing(true);
        
        // Extract only the relevant data that needs to be synced
        const dataToSync = {
          sidebarExpanded: adminStore.sidebarExpanded,
          adminTopNavShortcuts: adminStore.adminTopNavShortcuts,
          dashboardShortcuts: adminStore.dashboardShortcuts,
          isEditMode: adminStore.isEditMode,
          activeSection: adminStore.activeSection,
        };
        
        // Here we would save to the database
        console.log('Syncing to database:', dataToSync);
        
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setLastSyncTime(new Date());
      } catch (error) {
        console.error('Error syncing to database:', error);
      } finally {
        setIsSyncing(false);
      }
    };
    
    // Set up a debounced sync to database
    if (adminStore.preferencesChanged) {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(syncToDatabase, 1000);
    }
    
    return () => clearTimeout(syncTimeout);
  }, [
    adminStore.sidebarExpanded,
    adminStore.adminTopNavShortcuts,
    adminStore.dashboardShortcuts,
    adminStore.hasInitialized,
    adminStore.preferencesChanged,
  ]);
  
  return { isSyncing, lastSyncTime };
}
