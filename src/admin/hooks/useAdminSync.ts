
import { useEffect, useState } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';

/**
 * Hook to keep admin preferences in sync between UI, store and database
 */
export function useAdminSync() {
  const { savePreferences, syncing, lastSynced } = useAdminStore();
  const [isEditMode] = useAtom(adminEditModeAtom);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<Error | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(
    lastSynced ? new Date(lastSynced) : null
  );
  
  // Watch for edit mode changes to save preferences
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (!isEditMode) {
      setIsSyncing(true);
      
      try {
        savePreferences();
        // Simulate a delay for the sync to complete
        timeoutId = setTimeout(() => {
          setIsSyncing(false);
          setLastSyncTime(new Date());
          setSyncError(null);
        }, 500);
      } catch (error) {
        setIsSyncing(false);
        setSyncError(error as Error);
      }
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isEditMode, savePreferences]);
  
  return {
    isSyncing: isSyncing || syncing,
    lastSyncTime: lastSyncTime,
    syncError,
    isEditMode
  };
}
