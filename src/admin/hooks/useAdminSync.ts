
import { useState, useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook to sync admin data with backend
 */
export function useAdminSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const logger = useLogger('useAdminSync', LogCategory.ADMIN);
  
  // Sync data periodically
  useEffect(() => {
    let isMounted = true;
    
    const syncData = async () => {
      if (!isMounted) return;
      
      try {
        setIsSyncing(true);
        logger.info('Syncing admin data...');
        
        // Simulate sync with backend
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (isMounted) {
          setLastSynced(new Date());
          logger.info('Admin data synced successfully');
        }
      } catch (error) {
        logger.error('Error syncing admin data', { details: error });
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    };
    
    // Initial sync
    syncData();
    
    // Periodic sync every 5 minutes
    const interval = setInterval(syncData, 5 * 60 * 1000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [logger]);
  
  return {
    isSyncing,
    lastSynced,
    sync: async () => {
      setIsSyncing(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSynced(new Date());
      setIsSyncing(false);
    }
  };
}
