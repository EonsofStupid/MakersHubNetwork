
import { create } from 'zustand';
import { UserRole, Permission } from '@/shared/types/shared.types';

interface RBACState {
  roles: UserRole[];
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setRoles: (roles: UserRole[]) => void;
  addRole: (role: UserRole) => void;
  removeRole: (role: UserRole) => void;
  setPermissions: (permissions: Permission[]) => void;
  addPermission: (permission: Permission) => void;
  removePermission: (permission: Permission) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const rbacStore = create<RBACState>((set) => ({
  roles: [],
  permissions: [],
  isLoading: false,
  error: null,
  
  setRoles: (roles) => set(() => ({ roles })),
  
  addRole: (role) => set((state) => {
    if (state.roles.includes(role)) {
      return state;
    }
    return { roles: [...state.roles, role] };
  }),
  
  removeRole: (role) => set((state) => ({
    roles: state.roles.filter((r) => r !== role)
  })),
  
  setPermissions: (permissions) => set(() => ({ permissions })),
  
  addPermission: (permission) => set((state) => {
    if (state.permissions.includes(permission)) {
      return state;
    }
    return { permissions: [...state.permissions, permission] };
  }),
  
  removePermission: (permission) => set((state) => ({
    permissions: state.permissions.filter((p) => p !== permission)
  })),
  
  setError: (error) => set(() => ({ error })),
  
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
  
  reset: () => set(() => ({
    roles: [],
    permissions: [],
    isLoading: false,
    error: null
  }))
}));
