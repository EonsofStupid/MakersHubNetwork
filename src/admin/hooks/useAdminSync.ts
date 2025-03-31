
import { useEffect, useRef } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';

export function useAdminSync() {
  const { 
    preferencesChanged, 
    savePreferences, 
    syncFromDatabase,
    hasInitialized 
  } = useAdminStore();
  
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Save preferences when they change (debounced)
  useEffect(() => {
    if (!hasInitialized) return;
    
    if (preferencesChanged) {
      // Clear any existing timer
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
      
      // Set a new timer to save preferences after a delay
      syncTimerRef.current = setTimeout(() => {
        savePreferences();
      }, 2000); // 2 seconds debounce
    }
    
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [preferencesChanged, savePreferences, hasInitialized]);
  
  // Initial sync from database
  useEffect(() => {
    if (hasInitialized) {
      syncFromDatabase();
    }
  }, [syncFromDatabase, hasInitialized]);
  
  return {
    syncNow: savePreferences
  };
}
