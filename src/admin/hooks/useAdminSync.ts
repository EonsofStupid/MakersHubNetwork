
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for synchronizing admin state with the backend
 */
export function useAdminSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const logger = useLogger('AdminSync', LogCategory.ADMIN);

  const syncAdminState = async () => {
    if (isSyncing) {
      logger.warn('Sync already in progress, skipping');
      return false;
    }
    
    try {
      setIsSyncing(true);
      logger.info('Starting admin state sync');
      
      // Simulate sync process 
      await new Promise(resolve => setTimeout(resolve, 500));
      
      logger.info('Admin state synced successfully');
      toast({
        title: "Sync complete",
        description: "Admin state has been synchronized",
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      logger.error('Failed to sync admin state', { 
        details: { error: errorMessage } 
      });
      
      toast({
        title: "Sync failed",
        description: `Could not sync admin state: ${errorMessage}`,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSyncing(false);
    }
  };
  
  return {
    syncAdminState,
    isSyncing
  };
}
