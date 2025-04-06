
import { useState, useEffect, useCallback } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Hook for handling admin data synchronization
 */
export function useAdminSync() {
  const [isSyncingState, setIsSyncing] = useState(false);
  const adminStore = useAdminStore();
  const { user, status, isAuthenticated } = useAuthState();
  const logger = useLogger('useAdminSync', LogCategory.ADMIN);

  // Use proper debouncing for syncing state
  const debouncedSyncValue = useDebounce(isSyncingState, 300);

  // Function to sync admin data
  const syncData = useCallback(async () => {
    if (!user || !isAuthenticated) {
      logger.info('No user or not authenticated, skipping admin sync');
      return;
    }
    
    if (isSyncingState) {
      logger.info('Already syncing, skipping duplicate sync request');
      return;
    }
    
    try {
      setIsSyncing(true);
      
      logger.info('Syncing admin data');
      if (typeof adminStore.syncAdminData === 'function') {
        await adminStore.syncAdminData();
      } else {
        logger.warn('syncAdminData function not available in adminStore');
      }
      
      logger.info('Admin data sync complete');
    } catch (error) {
      logger.error('Error syncing admin data', error as Error);
    } finally {
      setIsSyncing(false);
    }
  }, [user, isAuthenticated, isSyncingState, adminStore, logger]);
  
  // Initialize and sync when auth status changes
  useEffect(() => {
    if (status === 'authenticated' && user) {
      logger.info('User authenticated, initializing admin data');
      
      // Use setTimeout to avoid potential React batching issues
      setTimeout(() => {
        syncData();
      }, 0);
    }
  }, [status, user, syncData, logger]);
  
  // Re-export the debounced syncing state
  return {
    isSyncing: debouncedSyncValue,
    syncAdminData: syncData,
    isInitialized: adminStore.initialized ?? false,
    hasPermission: adminStore.hasPermission ?? (() => false)
  };
}
