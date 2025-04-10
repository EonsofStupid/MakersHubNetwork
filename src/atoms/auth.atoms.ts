
/**
 * auth.atoms.ts
 * 
 * Jotai atoms that read from Zustand store but never write back.
 * These are used for derived state or UI components that need reactivity.
 */

import { atom } from 'jotai';
import { UserRole, ROLES, AuthStatus } from '@/types/shared';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Create a helper function to create atoms that are synchronized with the store
 * This avoids repeated boilerplate and ensures consistent behavior
 */
function atomWithStoreSync<T>(selector: (state: any) => T) {
  // Create a basic atom that reads from the store
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
export const isAdminAtom = atomWithStoreSync((state) => 
  state.roles.includes(ROLES.ADMIN) || state.roles.includes(ROLES.SUPER_ADMIN)
);

export const isSuperAdminAtom = atomWithStoreSync((state) => 
  state.roles.includes(ROLES.SUPER_ADMIN)
);

export const hasAdminAccessAtom = atomWithStoreSync((state) => 
  state.roles.includes(ROLES.ADMIN) || state.roles.includes(ROLES.SUPER_ADMIN)
);

// UI-specific derived atoms
export const userNameAtom = atom((get) => {
  const profile = get(profileAtom);
  const user = get(userAtom);
  
  return profile?.display_name || user?.user_metadata?.full_name || user?.email || 'User';
});

export const userAvatarAtom = atom((get) => {
  const profile = get(profileAtom);
  const user = get(userAtom);
  
  return profile?.avatar_url || user?.user_metadata?.avatar_url || null;
});

// For backward compatibility
export { isAuthenticatedAtom as authStatusAtom };

// Has role utility function atom - returns a function
export const hasRoleAtom = atom(
  (get) => (role: UserRole | UserRole[]): boolean => {
    const roles = get(rolesAtom);
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  }
);
