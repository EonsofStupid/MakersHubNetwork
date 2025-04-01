
import { useState, useEffect } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';

export function useAdminSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<Error | null>(null);
  const { savePreferences, shortcuts, isDarkMode, sidebarExpanded } = useAdminStore();
  
  const syncToDatabase = async () => {
    if (isSyncing) return;
    
    try {
      setIsSyncing(true);
      setSyncError(null);
      
      // Sync state to database
      await savePreferences({
        isDarkMode,
        sidebarExpanded,
        shortcuts
      });
      
      setLastSyncTime(new Date());
    } catch (error) {
      console.error("Error syncing to database:", error);
      setSyncError(error instanceof Error ? error : new Error("Failed to sync"));
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Auto-sync when admin store changes
  useEffect(() => {
    const syncTimer = setTimeout(() => {
      syncToDatabase();
    }, 2000); // Debounce sync to avoid too many requests
    
    return () => clearTimeout(syncTimer);
  }, [isDarkMode, shortcuts, sidebarExpanded]);
  
  return {
    isSyncing,
    lastSyncTime,
    syncError,
    syncToDatabase
  };
}
