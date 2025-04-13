
// Import jotai for atom state management
import { atom } from 'jotai';
import { UserProfile } from '@/shared/types/auth.types';
import { AuthStatus } from '@/shared/types/auth.types';
import { UserRole } from '@/shared/types/shared.types';

// Base atoms for auth state
export const userAtom = atom<UserProfile | null>(null);
export const statusAtom = atom<AuthStatus>(AuthStatus.IDLE);
export const rolesAtom = atom<UserRole[]>([]);
export const errorAtom = atom<string | null>(null);

// Derived atoms
export const isAuthenticatedAtom = atom(
  (get) => get(statusAtom) === AuthStatus.AUTHENTICATED
);

export const isAdminAtom = atom((get) => {
  const roles = get(rolesAtom);
  return roles.includes(UserRole.ADMIN) || roles.includes(UserRole.SUPERADMIN);
});

export const hasAdminAccessAtom = atom((get) => {
  const roles = get(rolesAtom);
  return roles.some(role => 
    [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.MODERATOR].includes(role)
  );
});

// User detail atoms
export const userNameAtom = atom((get) => {
  const user = get(userAtom);
  return user?.display_name || user?.email?.split('@')[0] || "Guest";
});

export const userAvatarAtom = atom((get) => {
  const user = get(userAtom);
  return user?.avatar_url || null;
});

// For backward compatibility
export type AuthStatusType = AuthStatus;
export { statusAtom as authStatusAtom };
