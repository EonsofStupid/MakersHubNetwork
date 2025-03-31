
import { useEffect, useRef, useState } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAuthStore } from '@/stores/auth/store';
import { toast } from 'sonner';
import { AdminDataService } from '@/admin/services/adminData.service';

export function useAdminSync() {
  const { 
    preferencesChanged, 
    savePreferences, 
    syncFromDatabase,
    hasInitialized,
    isEditMode,
  } = useAdminStore();
  
  const { user, roles } = useAuthStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const firstRenderRef = useRef(true);
  
  // Check if user has admin access
  const hasAdminAccess = roles?.includes('admin') || roles?.includes('super_admin');
  
  // Save preferences when they change (debounced)
  useEffect(() => {
    if (!hasInitialized || !hasAdminAccess || !user?.id) return;
    
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
      
      setIsSyncing(true);
      
      // Set a new timer to save preferences after a delay
      syncTimerRef.current = setTimeout(async () => {
        try {
          await savePreferences();
          setLastSyncTime(new Date());
          
          if (isEditMode) {
            toast.success("Changes saved", {
              description: "Your customizations have been saved"
            });
          }
        } finally {
          setIsSyncing(false);
        }
      }, 2000); // 2 seconds debounce
    }
    
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [preferencesChanged, savePreferences, hasInitialized, isEditMode, hasAdminAccess, user?.id]);
  
  // Initial sync from database when component mounts
  useEffect(() => {
    if (hasInitialized && hasAdminAccess && user?.id) {
      syncFromDatabase();
    }
  }, [syncFromDatabase, hasInitialized, hasAdminAccess, user?.id]);
  
  // Save preferences when edit mode turns off
  useEffect(() => {
    if (!isEditMode && preferencesChanged && hasInitialized && hasAdminAccess && user?.id) {
      savePreferences();
    }
  }, [isEditMode, preferencesChanged, savePreferences, hasInitialized, hasAdminAccess, user?.id]);
  
  const syncNow = async () => {
    if (!hasAdminAccess || !user?.id) {
      toast.error("Not authorized", {
        description: "You don't have permission to save admin preferences"
      });
      return false;
    }
    
    setIsSyncing(true);
    try {
      const result = await savePreferences();
      setLastSyncTime(new Date());
      return result;
    } finally {
      setIsSyncing(false);
    }
  };
  
  return {
    syncNow,
    isSyncing,
    lastSyncTime,
    hasAdminAccess
  };
}
