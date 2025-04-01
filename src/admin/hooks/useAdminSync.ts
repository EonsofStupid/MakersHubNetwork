
import { useEffect } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';

/**
 * Hook to keep admin preferences in sync between UI, store and database
 */
export function useAdminSync() {
  const { savePreferences } = useAdminStore();
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Watch for edit mode changes to save preferences
  useEffect(() => {
    if (!isEditMode) {
      savePreferences();
    }
  }, [isEditMode, savePreferences]);
  
  return null;
}
