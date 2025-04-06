
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
  sidebarExpanded: boolean;
  isLoadingPermissions: boolean;
  initialized: boolean;
}

interface AdminActions {
  setPermissions: (permissions: AdminPermissionValue[]) => void;
  setSelectedEntityId: (id: string | null) => void;
  setEditMode: (isEditMode: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setCurrentView: (view: string) => void;
  toggleSidebar: () => void;
  savePreferences: () => Promise<void>;
  loadPermissions: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

export type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>((set, get) => {
  const logger = getLogger();

  return {
    // State
    permissions: [],
    selectedEntityId: null,
    isEditMode: false,
    isSaving: false,
    currentView: 'overview',
    sidebarExpanded: true,
    isLoadingPermissions: false,
    initialized: false,
    
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
    
    setCurrentView: (currentView) => set({ currentView }),
    
    toggleSidebar: () => {
      set(state => ({ sidebarExpanded: !state.sidebarExpanded }));
    },
    
    savePreferences: async () => {
      logger.info('Saving admin preferences', {
        category: LogCategory.ADMIN,
        source: 'admin.store'
      });
      // Actual implementation could save to user preferences
      return Promise.resolve();
    },
    
    loadPermissions: async () => {
      try {
        logger.info('Loading admin permissions', {
          category: LogCategory.ADMIN,
          source: 'admin.store'
        });
        set({ isLoadingPermissions: true });
        // Actual implementation would load from API or local storage
        // For now, we're just resolving
        set({ isLoadingPermissions: false, initialized: true });
        return Promise.resolve();
      } catch (error) {
        logger.error('Failed to load permissions', {
          category: LogCategory.ADMIN,
          source: 'admin.store',
          details: { error }
        });
        set({ isLoadingPermissions: false });
        throw error;
      }
    },
    
    hasRole: (role) => {
      // Simple implementation that checks if role is in permissions
      return get().permissions.includes(role as AdminPermissionValue);
    }
  };
});
