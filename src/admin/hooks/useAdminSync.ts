
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { errorToObject } from '@/shared/utils/render';

// Configuration for rate limiting
const SYNC_CONFIG = {
  MIN_SYNC_INTERVAL: 30000,       // 30 seconds minimum between syncs
  MAX_SYNC_ATTEMPTS: 5,           // Maximum consecutive sync attempts
  INITIAL_SYNC_DELAY: 1000,       // Initial sync delay
  AUTO_SYNC_INTERVAL: 5 * 60000,  // 5 minutes between auto syncs
  COOLDOWN_PERIOD: 60000,         // 1 minute cooldown after max attempts
};

/**
 * Hook to sync admin data with backend with improved rate limiting
 */
export function useAdminSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const logger = useLogger('useAdminSync', LogCategory.ADMIN);
  
  // Track sync attempts and state
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const syncAttemptCountRef = useRef<number>(0);
  const inCooldownRef = useRef<boolean>(false);
  
  // Track the last sync time to enforce minimum interval
  const lastSyncTimeRef = useRef<number>(0);
  
  // Queue for pending sync requests
  const pendingSyncRef = useRef<boolean>(false);
  
  // Cleanup function
  const cleanupSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
  }, []);
  
  // Reset attempt counter after cooldown
  const resetSyncAttempts = useCallback(() => {
    syncAttemptCountRef.current = 0;
    inCooldownRef.current = false;
    logger.debug('Sync attempts counter reset after cooldown');
  }, [logger]);
  
  // Enter cooldown mode when too many attempts occur
  const enterCooldown = useCallback(() => {
    if (inCooldownRef.current) return;
    
    inCooldownRef.current = true;
    logger.warn(`Entering sync cooldown period for ${SYNC_CONFIG.COOLDOWN_PERIOD}ms`);
    
    syncTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        resetSyncAttempts();
      }
    }, SYNC_CONFIG.COOLDOWN_PERIOD);
  }, [logger, resetSyncAttempts]);
  
  // Safe state update function with timeout check
  const safeSetIsSyncing = useCallback((value: boolean) => {
    if (isMountedRef.current) {
      // Small delay to avoid state updates during unmounting
      setTimeout(() => {
        if (isMountedRef.current) {
          setIsSyncing(value);
        }
      }, 0);
    }
  }, []);
  
  // Sync data with rate limiting
  const syncData = useCallback(async (force = false) => {
    // Skip if already syncing or in cooldown (unless forced)
    if (isSyncing && !force) {
      pendingSyncRef.current = true;
      logger.debug('Sync already in progress, queueing request');
      return;
    }
    
    if (inCooldownRef.current && !force) {
      logger.debug('In cooldown period, sync request ignored');
      return;
    }
    
    // Check if we've exceeded maximum sync attempts
    if (syncAttemptCountRef.current >= SYNC_CONFIG.MAX_SYNC_ATTEMPTS && !force) {
      enterCooldown();
      return;
    }
    
    // Enforce minimum time between syncs
    const now = Date.now();
    if (!force && now - lastSyncTimeRef.current < SYNC_CONFIG.MIN_SYNC_INTERVAL) {
      logger.debug('Sync requested too soon, scheduling for later');
      
      // Schedule a sync after the minimum interval has passed
      cleanupSync();
      syncTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          syncData(true);
        }
      }, SYNC_CONFIG.MIN_SYNC_INTERVAL - (now - lastSyncTimeRef.current));
      
      return;
    }
    
    // If we made it here, we're actually going to sync
    pendingSyncRef.current = false;
    
    // Increment attempt counter for rate limiting
    if (!force) {
      syncAttemptCountRef.current += 1;
    }
    
    if (!isMountedRef.current) return;
    
    try {
      safeSetIsSyncing(true);
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
        
        return { success: true };
      }
      
      return { success: true }; 
    } catch (error) {
      logger.error('Error syncing admin data', { details: errorToObject(error) });
      return { success: false, error };
    } finally {
      if (isMountedRef.current) {
        safeSetIsSyncing(false);
        
        // If there was another sync requested during this one, trigger it
        if (pendingSyncRef.current) {
          pendingSyncRef.current = false;
          // Add a small delay to prevent immediate re-execution
          syncTimeoutRef.current = setTimeout(() => {
            syncData(false);
          }, 500);
        }
      }
    }
  }, [isSyncing, cleanupSync, enterCooldown, logger, safeSetIsSyncing]);
  
  // Sync once on mount with debouncing
  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial sync with small delay to avoid contention
    syncTimeoutRef.current = setTimeout(() => {
      syncData(true);
    }, SYNC_CONFIG.INITIAL_SYNC_DELAY);
    
    // Periodic sync every 5 minutes
    syncIntervalRef.current = setInterval(() => {
      syncData(true); // Force periodic syncs
    }, SYNC_CONFIG.AUTO_SYNC_INTERVAL);
    
    return () => {
      isMountedRef.current = false;
      cleanupSync();
      
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [cleanupSync, syncData]);
  
  // Public API
  return {
    isSyncing,
    lastSynced,
    sync: useCallback(async (force = false) => {
      return await syncData(force);
    }, [syncData])
  };
}
