
import { atom } from 'jotai';
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth.types';

// Import the auth store as the single source of truth
import { useAuthStore } from '../store/auth.store';

// Define read-only derived atoms from Zustand store
// These atoms don't store state, they just read from Zustand
export const userAtom = atom((get) => useAuthStore.getState().user);
export const rolesAtom = atom((get) => useAuthStore.getState().roles);
export const isAuthenticatedAtom = atom((get) => useAuthStore.getState().isAuthenticated);
export const isAdminAtom = atom((get) => useAuthStore.getState().isAdmin());
export const hasAdminAccessAtom = atom((get) => useAuthStore.getState().isAdmin());

// Create derived UI atoms
export const userNameAtom = atom((get) => {
  const user = useAuthStore.getState().user;
  return user?.user_metadata?.full_name || user?.email || 'User';
});

export const userAvatarAtom = atom((get) => {
  const user = useAuthStore.getState().user;
  return user?.user_metadata?.avatar_url || null;
});

// Auth status type definition
export type AuthStatusType = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

// Auth status atom (legacy)
export { isAuthenticatedAtom as authStatusAtom };
