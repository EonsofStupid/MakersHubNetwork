
import { atom } from 'jotai';
import { UserRole, AuthStatus, User } from '@/shared/types/shared.types';

// Core auth atoms
export const userAtom = atom<User | null>(null);
export const profileAtom = atom<any | null>(null);
export const rolesAtom = atom<UserRole[]>([]);
export const authStatusAtom = atom<AuthStatus>(AuthStatus.IDLE);
export const authErrorAtom = atom<Error | null>(null);

// Derived atoms
export const isAuthenticatedAtom = atom(
  (get) => get(authStatusAtom) === AuthStatus.AUTHENTICATED
);

export const isLoadingAtom = atom(
  (get) => get(authStatusAtom) === AuthStatus.LOADING
);

export const userNameAtom = atom(
  (get) => get(profileAtom)?.display_name || get(userAtom)?.email?.split('@')[0] || 'User'
);

export const userAvatarAtom = atom(
  (get) => get(profileAtom)?.avatar_url || null
);

export const isAdminAtom = atom(
  (get) => {
    const roles = get(rolesAtom);
    return roles.includes(UserRole.ADMIN) || roles.includes(UserRole.SUPER_ADMIN);
  }
);

export const hasAdminAccessAtom = atom(
  (get) => get(isAdminAtom)
);

// Type export for intellisense
export type AuthStatusType = AuthStatus;
