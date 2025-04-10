
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

// Create a helper function to create atoms that are synchronized with the store
function atomWithStoreSync<T>(selector: (state: any) => T) {
  // Create a derived atom that updates when the store updates
  return atom((get) => {
    return selector(useAuthStore.getState());
  });
}

// Core state atoms - all derived from Zustand store
export const userAtom = atomWithStoreSync((state) => state.user);
export const sessionAtom = atomWithStoreSync((state) => state.session);
export const profileAtom = atomWithStoreSync((state) => state.profile);
export const rolesAtom = atomWithStoreSync((state) => state.roles);
export const statusAtom = atomWithStoreSync((state) => state.status);
export const isAuthenticatedAtom = atomWithStoreSync((state) => state.isAuthenticated);
export const authErrorAtom = atomWithStoreSync((state) => state.error);
export const isLoadingAtom = atomWithStoreSync((state) => state.isLoading);

// Derived state atoms
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
  
  return profile?.display_name || user?.user_metadata?.full_name as string || user?.email || 'User';
});

export const userAvatarAtom = atom<string | null>((get) => {
  const profile = get(profileAtom);
  const user = get(userAtom);
  
  return profile?.avatar_url || 
         user?.user_metadata?.avatar_url as string || 
         null;
});

// For backward compatibility
export type AuthStatusType = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
export { isAuthenticatedAtom as authStatusAtom };

// Function atoms with proper typing
export const logoutAtom = atom<() => Promise<void>>(
  (get) => {
    return useAuthStore.getState().logout;
  }
);

// Has role utility function atom - returns a function
export const hasRoleAtom = atom<(role: UserRole | UserRole[]) => boolean>(
  (get) => (role: UserRole | UserRole[]): boolean => {
    const roles = get(rolesAtom);
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  }
);
