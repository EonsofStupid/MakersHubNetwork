import { atom } from 'jotai';
import { RBACBridge } from '@/bridges/RBACBridge';
import { UserRole, Permission } from '@/types/shared';

/**
 * Read-only atoms derived from RBAC store
 */

export const rolesAtom = atom<UserRole[]>(() => RBACBridge.getRoles());

export const hasRoleAtom = atom(
  null,
  (get, set, check: UserRole | UserRole[]) => RBACBridge.hasRole(check)
);

export const canAtom = atom(
  null,
  (get, set, permission: Permission) => RBACBridge.can(permission)
);

export const canAccessRouteAtom = atom(
  null,
  (get, set, route: string) => RBACBridge.canAccessRoute(route)
);

export const isAdminAtom = atom<boolean>(() => RBACBridge.isAdmin());

export const isSuperAdminAtom = atom<boolean>(() => RBACBridge.isSuperAdmin());

export const isModeratorAtom = atom<boolean>(() => RBACBridge.isModerator());

export const isBuilderAtom = atom<boolean>(() => RBACBridge.isBuilder()); 