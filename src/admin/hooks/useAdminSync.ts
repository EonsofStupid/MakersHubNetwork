
import { useEffect } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to synchronize admin state between local storage and database
 */
export function useAdminSync() {
  const { savePreferences, loadPreferences } = useAdminStore();

  // Sync preferences with database
  useEffect(() => {
    // Load preferences from database
    loadPreferences();

    // Subscribe to auth state changes to sync preferences
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Load user preferences when they sign in
        loadPreferences();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadPreferences]);

  return {
    saveToDatabase: savePreferences
  };
}
