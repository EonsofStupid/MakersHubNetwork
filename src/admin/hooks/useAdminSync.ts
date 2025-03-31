
import { useEffect, useRef } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { toast } from 'sonner';

export function useAdminSync() {
  const { 
    preferencesChanged, 
    savePreferences, 
    syncFromDatabase,
    hasInitialized,
    isEditMode,
  } = useAdminStore();
  
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const firstRenderRef = useRef(true);
  
  // Save preferences when they change (debounced)
  useEffect(() => {
    if (!hasInitialized) return;
    
    // Skip the first render to avoid immediate saving
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    
    if (preferencesChanged) {
      // Clear any existing timer
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
      
      // Set a new timer to save preferences after a delay
      syncTimerRef.current = setTimeout(() => {
        savePreferences().then(() => {
          if (isEditMode) {
            toast.success("Changes saved", {
              description: "Your customizations have been saved"
            });
          }
        });
      }, 2000); // 2 seconds debounce
    }
    
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [preferencesChanged, savePreferences, hasInitialized, isEditMode]);
  
  // Initial sync from database when component mounts
  useEffect(() => {
    if (hasInitialized) {
      syncFromDatabase();
    }
  }, [syncFromDatabase, hasInitialized]);
  
  // Save preferences when edit mode turns off
  useEffect(() => {
    if (!isEditMode && preferencesChanged && hasInitialized) {
      savePreferences();
    }
  }, [isEditMode, preferencesChanged, savePreferences, hasInitialized]);
  
  return {
    syncNow: savePreferences
  };
}
