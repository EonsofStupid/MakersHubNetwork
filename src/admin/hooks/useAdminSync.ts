
import { useEffect, useState } from 'react';
import { subscribeToAuthEvents } from '@/auth/bridge';
import { useAdminStore } from '@/admin/store/admin.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook to synchronize admin state with authentication events
 */
export function useAdminSync() {
  const { setPermissions, setIsAuthenticated } = useAdminStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<Error | null>(null);
  const logger = useLogger('AdminSync', LogCategory.ADMIN);
  
  // Function to save admin state to database
  const saveToDatabase = async () => {
    setIsSyncing(true);
    try {
      // Implementation would go here
      setLastSyncTime(new Date());
      setSyncError(null);
    } catch (error) {
      setSyncError(error instanceof Error ? error : new Error('Unknown error during sync'));
      logger.error('Error syncing admin data', { details: error });
    } finally {
      setIsSyncing(false);
    }
  };
  
  useEffect(() => {
    logger.info('Setting up admin auth sync');
    
    // Subscribe to authentication events
    const unsubscribe = subscribeToAuthEvents((event) => {
      logger.info(`Admin received auth event: ${event.type}`, {
        details: { eventType: event.type }
      });
      
      switch (event.type) {
        case 'AUTH_SIGNED_IN':
          setIsAuthenticated(true);
          // We'll set permissions via the useAdminPermissions hook
          break;
          
        case 'AUTH_SIGNED_OUT':
          setIsAuthenticated(false);
          setPermissions([]);
          break;
      }
    });
    
    return () => {
      logger.info('Cleaning up admin auth sync');
      unsubscribe();
    };
  }, [logger, setIsAuthenticated, setPermissions]);
  
  return {
    isSyncing,
    lastSyncTime,
    syncError,
    saveToDatabase
  };
}
