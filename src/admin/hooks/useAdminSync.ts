
import { useState, useEffect, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function useAdminSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncTimeoutRef = useRef<number | null>(null);
  const logger = useLogger('useAdminSync', LogCategory.ADMIN);

  // Simulate sync process - in a real app, this would connect to a backend
  const syncAdminData = async () => {
    if (isSyncing) return;
    
    try {
      setIsSyncing(true);
      setSyncError(null);
      logger.info('Starting admin data sync');
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 10% chance of simulated error for testing
      if (Math.random() < 0.1) {
        throw new Error('Simulated sync error');
      }
      
      setLastSyncTime(Date.now());
      logger.info('Admin data sync completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSyncError(errorMessage);
      logger.error('Admin data sync failed', { details: { error: errorMessage } });
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial sync on mount
  useEffect(() => {
    syncAdminData();
    
    // Schedule periodic sync every 5 minutes
    const intervalId = setInterval(() => {
      syncAdminData();
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    triggerSync: syncAdminData
  };
}
