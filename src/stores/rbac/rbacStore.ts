import { create } from 'zustand';
import { UserRoleType, UserRoleEnum } from '@/shared/types/SharedTypes';
import { AuthPermissionValue } from '@/auth/constants/permissions';
import { mapRolesToPermissions } from '@/auth/rbac/roles';

// RBAC State
export interface RBACState {
  roles: UserRoleType[];
  permissions: AuthPermissionValue[];
  isLoading: boolean;
  error: string | null;
  setRoles: (roles: UserRoleType[]) => void;
  addRole: (role: UserRoleType) => void;
  removeRole: (role: UserRoleType) => void;
  setError: (error: string) => void;
  setLoading: (isLoading: boolean) => void;
  hasRole: (check: UserRoleType | UserRoleType[]) => boolean;
  can: (action: AuthPermissionValue) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
}

// Initial state
const initialState = {
  roles: [UserRoleEnum.GUEST],
  permissions: [],
  isLoading: false,
  error: null
};

// RBAC Store
export const useRbacStore = create<RBACState>((set, get) => ({
  ...initialState,

  setRoles: (roles: UserRoleType[]) => {
    const permissions = mapRolesToPermissions(roles);
    set({ roles, permissions, isLoading: false, error: null });
  },

  addRole: (role: UserRoleType) => {
    const { roles } = get();
    if (roles.includes(role)) return;
    const newRoles = [...roles, role];
    const permissions = mapRolesToPermissions(newRoles);
    set({ roles: newRoles, permissions });
  },

  removeRole: (role: UserRoleType) => {
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

  hasRole: (check: UserRoleType | UserRoleType[]) => {
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
    return roles.includes(UserRoleEnum.ADMIN);
  },

  isSuperAdmin: () => {
    const { roles } = get();
    return roles.includes(UserRoleEnum.SUPERADMIN);
  },

  isModerator: () => {
    const { roles } = get();
    return roles.includes(UserRoleEnum.MODERATOR);
  },

  isBuilder: () => {
    const { roles } = get();
    return roles.includes(UserRoleEnum.BUILDER);
  }
})); 