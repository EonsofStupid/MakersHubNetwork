
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
      if (typeof adminStore.loadPermissions === 'function') {
        await adminStore.loadPermissions();
        logger.info('Admin data sync complete');
      } else {
        logger.warn('loadPermissions function not available in adminStore');
      }
    } catch (error) {
      logger.error('Error syncing admin data', {
        details: error instanceof Error ? { message: error.message } : { message: String(error) }
      });
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
  
  // Return proper interface
  return {
    isSyncing: debouncedSyncValue,
    syncAdminData: syncData,
    isInitialized: adminStore.initialized ?? false,
    hasPermission: adminStore.hasRole ?? (() => false)
  };
}
