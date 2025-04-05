
import { useState, useEffect, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { errorToObject } from '@/shared/utils/render';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Hook to sync admin data with backend with rate limiting
 */
export function useAdminSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const logger = useLogger('useAdminSync', LogCategory.ADMIN);
  
  // Track sync attempts to prevent excessive calls
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const syncAttemptCountRef = useRef<number>(0);
  const MIN_SYNC_INTERVAL = 30000; // 30 seconds minimum between syncs
  
  // Track the last sync time to enforce minimum interval
  const lastSyncTimeRef = useRef<number>(0);
  
  // Cleanup function
  const cleanupSync = () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
  };
  
  // Sync data with rate limiting
  const syncData = async (force = false) => {
    // Skip if already syncing
    if (isSyncing) return;
    
    // Check if we've exceeded maximum sync attempts (prevent runaway loops)
    if (syncAttemptCountRef.current > 5 && !force) {
      logger.warn('Too many sync attempts, cooling down');
      return;
    }
    
    // Enforce minimum time between syncs
    const now = Date.now();
    if (!force && now - lastSyncTimeRef.current < MIN_SYNC_INTERVAL) {
      logger.debug('Sync requested too soon, debouncing');
      
      // Schedule a sync after the minimum interval has passed
      cleanupSync();
      syncTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          syncData(true);
        }
      }, MIN_SYNC_INTERVAL);
      
      return;
    }
    
    // Increment attempt counter
    syncAttemptCountRef.current += 1;
    
    if (!isMountedRef.current) return;
    
    try {
      setIsSyncing(true);
      logger.info('Syncing admin data...');
      
      // Update last sync time reference
      lastSyncTimeRef.current = now;
      
      // Simulate sync with backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isMountedRef.current) {
        setLastSynced(new Date());
        logger.info('Admin data synced successfully');
        
        // Reset attempt counter on success
        syncAttemptCountRef.current = 0;
      }
    } catch (error) {
      logger.error('Error syncing admin data', { details: errorToObject(error) });
    } finally {
      if (isMountedRef.current) {
        setIsSyncing(false);
      }
    }
  };
  
  // Sync once on mount with debouncing
  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial sync with small delay to avoid contention
    syncTimeoutRef.current = setTimeout(() => {
      syncData(true);
    }, 1000);
    
    // Periodic sync every 5 minutes
    const interval = setInterval(() => {
      syncData(true); // Force periodic syncs
    }, 5 * 60 * 1000);
    
    return () => {
      isMountedRef.current = false;
      cleanupSync();
      clearInterval(interval);
    };
  }, []);
  
  // Public API
  return {
    isSyncing,
    lastSynced,
    sync: async (force = false) => {
      await syncData(force);
    }
  };
}
