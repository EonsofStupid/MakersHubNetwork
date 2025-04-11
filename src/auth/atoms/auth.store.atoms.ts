
/**
 * auth.store.atoms.ts
 *
 * Properly typed Jotai atoms that read from Zustand store
 * This is the boundary layer that ensures components can only read from the store
 * but never write directly to it
 */

import { atom } from 'jotai';
import { UserRole } from '@/types/shared';
import { useAuthStore } from '@/auth/store/auth.store';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/auth/store/auth.store';
import { AuthBridge } from '@/bridges/AuthBridge';

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

// Derived state atoms that use AuthBridge to ensure consistent role checks
export const isAdminAtom = atom<boolean>((get) => {
  // Use AuthBridge to ensure consistent role checks across the app
  return AuthBridge.isAdmin();
});

export const isSuperAdminAtom = atom<boolean>((get) => {
  // Use AuthBridge to ensure consistent role checks across the app
  return AuthBridge.isSuperAdmin();
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
export { isAuthenticatedAtom as authStatusAtom };

// Function atoms with proper typing
export const logoutAtom = atom<() => Promise<void>>(
  (get) => {
    // Use AuthBridge for auth actions to ensure consistent behavior
    return AuthBridge.logout;
  }
);

// Has role utility function atom - returns a function
export const hasRoleAtom = atom<(role: UserRole | UserRole[]) => boolean>(
  (get) => (role: UserRole | UserRole[]): boolean => {
    // Use AuthBridge for role checks to ensure consistent behavior
    return AuthBridge.hasRole(role);
  }
);
