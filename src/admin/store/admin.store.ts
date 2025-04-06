
import { create } from 'zustand';
import { AdminPermissionValue } from '../constants/permissions';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

interface AdminState {
  permissions: AdminPermissionValue[];
  selectedEntityId: string | null;
  isEditMode: boolean;
  isSaving: boolean;
  currentView: string;
}

interface AdminActions {
  setPermissions: (permissions: AdminPermissionValue[]) => void;
  setSelectedEntityId: (id: string | null) => void;
  setEditMode: (isEditMode: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setCurrentView: (view: string) => void;
}

export type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>((set) => {
  const logger = getLogger();

  return {
    // State
    permissions: [],
    selectedEntityId: null,
    isEditMode: false,
    isSaving: false,
    currentView: 'overview',
    
    // Actions
    setPermissions: (permissions) => {
      logger.info('Setting admin permissions', {
        category: LogCategory.ADMIN,
        source: 'admin.store',
        details: { 
          permissionCount: permissions.length
        }
      });
      set({ permissions });
    },
    
    setSelectedEntityId: (id) => set({ selectedEntityId: id }),
    
    setEditMode: (isEditMode) => {
      logger.info(`${isEditMode ? 'Entering' : 'Exiting'} admin edit mode`, {
        category: LogCategory.ADMIN,
        source: 'admin.store'
      });
      set({ isEditMode });
    },
    
    setSaving: (isSaving) => set({ isSaving }),
    
    setCurrentView: (currentView) => set({ currentView })
  };
});
