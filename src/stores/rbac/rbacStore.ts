import { create } from 'zustand';
import { UserRole } from '@/rbac/constants/roles';
import { Permission } from '@/shared/types/permissions';
import { AuthPermissionValue } from '@/auth/constants/permissions';
import { mapRolesToPermissions } from '@/auth/rbac/roles';

// RBAC State
export interface RBACState {
  roles: UserRole[];
  permissions: AuthPermissionValue[];
  isLoading: boolean;
  error: string | null;
  setRoles: (roles: UserRole[]) => void;
  addRole: (role: UserRole) => void;
  removeRole: (role: UserRole) => void;
  setError: (error: string) => void;
  setLoading: (isLoading: boolean) => void;
  hasRole: (check: UserRole | UserRole[]) => boolean;
  can: (action: AuthPermissionValue) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
}

// Initial state
const initialState = {
  roles: [UserRole.GUEST],
  permissions: [],
  isLoading: false,
  error: null
};

// RBAC Store
export const useRbacStore = create<RBACState>((set, get) => ({
  ...initialState,

  setRoles: (roles: UserRole[]) => {
    const permissions = mapRolesToPermissions(roles);
    set({ roles, permissions, isLoading: false, error: null });
  },

  addRole: (role: UserRole) => {
    const { roles } = get();
    if (roles.includes(role)) return;
    const newRoles = [...roles, role];
    const permissions = mapRolesToPermissions(newRoles);
    set({ roles: newRoles, permissions });
  },

  removeRole: (role: UserRole) => {
    const { roles } = get();
    const newRoles = roles.filter(r => r !== role);
    const permissions = mapRolesToPermissions(newRoles);
    set({ roles: newRoles, permissions });
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

  can: (action: AuthPermissionValue) => {
    const { permissions } = get();
    return permissions.includes(action);
  },

  isAdmin: () => {
    const { roles } = get();
    return roles.includes(UserRole.ADMIN);
  },

  isSuperAdmin: () => {
    const { roles } = get();
    return roles.includes(UserRole.SUPER_ADMIN);
  },

  isModerator: () => {
    const { roles } = get();
    return roles.includes(UserRole.MODERATOR);
  },

  isBuilder: () => {
    const { roles } = get();
    return roles.includes(UserRole.BUILDER);
  }
}));
