
import { useEffect, useState } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to synchronize admin state between local storage and database
 */
export function useAdminSync() {
  const { savePreferences, initializeStore } = useAdminStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Sync preferences with database
  useEffect(() => {
    // Set syncing state
    setIsSyncing(true);
    
    // Initialize store
    initializeStore()
      .then(() => {
        setLastSyncTime(new Date());
        setSyncError(null);
      })
      .catch(error => {
        console.error("Error syncing admin preferences:", error);
        setSyncError(error instanceof Error ? error.message : "Unknown error");
      })
      .finally(() => {
        setIsSyncing(false);
      });

    // Subscribe to auth state changes to sync preferences
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Load user preferences when they sign in
        setIsSyncing(true);
        initializeStore()
          .then(() => {
            setLastSyncTime(new Date());
            setSyncError(null);
          })
          .catch(error => {
            setSyncError(error instanceof Error ? error.message : "Unknown error");
          })
          .finally(() => {
            setIsSyncing(false);
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeStore]);

  const saveToDatabase = async () => {
    try {
      setIsSyncing(true);
      setSyncError(null);
      await savePreferences();
      setLastSyncTime(new Date());
    } catch (error) {
      console.error("Error saving to database:", error);
      setSyncError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    saveToDatabase,
    isSyncing,
    lastSyncTime,
    syncError
  };
}
