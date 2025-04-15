import { create } from 'zustand';
import { UserRole } from '@/shared/types/core/auth.types';
import { Permission } from '@/shared/types/core/rbac.types';

// RBAC State
export interface RBACState {
  roles: UserRole[];
  permissions: string[];
  isLoading: boolean;
  error: string | null;
  setRoles: (roles: UserRole[]) => void;
  addRole: (role: UserRole) => void;
  removeRole: (role: UserRole) => void;
  setError: (error: string) => void;
  setLoading: (isLoading: boolean) => void;
  hasRole: (check: UserRole | UserRole[]) => boolean;
  can: (action: string) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
}

// Initial state
const initialState = {
  roles: [],
  permissions: [],
  isLoading: false,
  error: null
};

// RBAC Store
export const useRbacStore = create<RBACState>((set, get) => ({
  ...initialState,

  setRoles: (roles: UserRole[]) => {
    set({ roles, isLoading: false, error: null });
  },

  addRole: (role: UserRole) => {
    const { roles } = get();
    if (roles.includes(role)) return;
    set({ roles: [...roles, role] });
  },

  removeRole: (role: UserRole) => {
    const { roles } = get();
    set({ roles: roles.filter(r => r !== role) });
  },

  setError: (error: string) => {
    set({ error, isLoading: false });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  hasRole: (check: UserRole | UserRole[]) => {
    const { roles } = get();
    const rolesToCheck = Array.isArray(check) ? check : [check];
    return rolesToCheck.some(role => roles.includes(role));
  },

  can: (action: string) => {
    const { permissions } = get();
    return permissions.includes(action);
  },

  isAdmin: () => {
    const { roles } = get();
    return roles.includes('admin');
  },

  isSuperAdmin: () => {
    const { roles } = get();
    return roles.includes('super_admin');
  },

  isModerator: () => {
    const { roles } = get();
    return roles.includes('moderator');
  },

  isBuilder: () => {
    const { roles } = get();
    return roles.includes('builder');
  }
}));
