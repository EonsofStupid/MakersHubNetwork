
import { useState, useCallback } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for syncing admin data
 */
export function useAdminSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const logger = useLogger('useAdminSync', { category: LogCategory.ADMIN });
  const { toast } = useToast();
  
  /**
   * Sync admin data from the server
   */
  const syncAdminData = useCallback(async () => {
    if (isSyncing) return false;
    
    try {
      setIsSyncing(true);
      logger.info('Starting admin data sync');
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update last sync time
      const now = new Date();
      setLastSyncTime(now);
      
      logger.info('Admin data sync completed', {
        details: { timestamp: now.toISOString() }
      });
      
      toast({
        title: 'Sync completed',
        description: 'Admin data has been synchronized',
      });
      
      return true;
    } catch (error) {
      logger.error('Admin data sync failed', {
        details: { error }
      });
      
      toast({
        title: 'Sync failed',
        description: 'There was an error synchronizing admin data',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, logger, toast]);
  
  return {
    isSyncing,
    lastSyncTime,
    syncAdminData
  };
}
