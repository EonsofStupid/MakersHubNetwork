
import { create } from 'zustand';
import { authBridge } from '@/bridges/AuthBridge';
import { UserRole } from '@/shared/types/shared.types';
import { ADMIN_PERMISSIONS } from '../constants/permissions';

export interface AdminState {
  roles: UserRole[];
  permissions: string[];
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  roles: [],
  permissions: [],
  isInitialized: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Subscribe to auth events
      const unsubscribe = authBridge.subscribeToEvent('AUTH_STATE_CHANGE', (event) => {
        if (event.user) {
          // Extract roles from user
          const roles = (event.user?.app_metadata?.roles || []) as UserRole[];
          
          // Derive permissions from roles
          const permissions: string[] = [];
          
          if (roles.includes('super_admin')) {
            // Superadmin has all permissions
            Object.values(ADMIN_PERMISSIONS).forEach(permission => {
              permissions.push(permission);
            });
          } else if (roles.includes('admin')) {
            // Admin has specific permissions
            permissions.push(
              ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL,
              ADMIN_PERMISSIONS.MANAGE_USERS,
              ADMIN_PERMISSIONS.MANAGE_CONTENT,
              ADMIN_PERMISSIONS.MANAGE_SETTINGS
            );
          } else if (roles.includes('moderator')) {
            // Moderator has limited permissions
            permissions.push(
              ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL,
              ADMIN_PERMISSIONS.MANAGE_CONTENT
            );
          }
          
          set({ roles, permissions });
        } else {
          set({ roles: [], permissions: [] });
        }
      });
      
      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize admin store',
        isLoading: false
      });
    }
  },

  hasPermission: (permission) => {
    const { permissions } = get();
    return permissions.includes(permission);
  },

  hasRole: (role) => {
    const { roles } = get();
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  }
}));
