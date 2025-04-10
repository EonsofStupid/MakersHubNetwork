/**
 * auth.store.atoms.ts
 *
 * Properly typed Jotai atoms that read from Zustand store
 * Follows best practices for typing function atoms
 */

import { atom } from 'jotai';
import { UserRole } from '@/types/shared';
import { useAuthStore } from '@/auth/store/auth.store';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/auth/store/auth.store';

// State atoms (type-safe)
export const userAtom = atom<User | null>(useAuthStore.getState().user);
export const sessionAtom = atom<Session | null>(useAuthStore.getState().session);
export const profileAtom = atom<UserProfile | null>(useAuthStore.getState().profile);
export const rolesAtom = atom<UserRole[]>(useAuthStore.getState().roles);
export const isAuthenticatedAtom = atom<boolean>(useAuthStore.getState().isAuthenticated);
export const authStatusAtom = atom<string>(useAuthStore.getState().status);

// Function atoms (explicit typing to avoid 'never' inference)
export const logoutAtom = atom<() => Promise<void>>(() => useAuthStore.getState().logout);
export const hasRoleAtom = atom<(role: UserRole | UserRole[]) => boolean>((get) => {
  return (role) => {
    const roles = get(rolesAtom);
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    return roles.includes(role);
  };
});

// Derived state atoms with proper typing
export const isAdminAtom = atom<boolean>((get) => {
  const roles = get(rolesAtom);
  return roles.includes('admin') || roles.includes('super_admin');
});

export const isSuperAdminAtom = atom<boolean>((get) => {
  const roles = get(rolesAtom);
  return roles.includes('super_admin');
});

export const hasAdminAccessAtom = atom<boolean>((get) => {
  return get(isAdminAtom);
});

// UI-specific derived atoms
export const userNameAtom = atom<string>((get) => {
  const profile = get(profileAtom);
  const user = get(userAtom);
  
  return profile?.display_name || 
         user?.user_metadata?.full_name as string || 
         user?.email || 
         'User';
});

export const userAvatarAtom = atom<string | null>((get) => {
  const profile = get(profileAtom);
  const user = get(userAtom);
  
  return profile?.avatar_url || 
         user?.user_metadata?.avatar_url as string || 
         null;
});

// Keep authStore sync with atoms
useAuthStore.subscribe((state) => {
  userAtom.write(state.user);
  sessionAtom.write(state.session);
  profileAtom.write(state.profile);
  rolesAtom.write(state.roles);
  isAuthenticatedAtom.write(state.isAuthenticated);
  authStatusAtom.write(state.status);
});
