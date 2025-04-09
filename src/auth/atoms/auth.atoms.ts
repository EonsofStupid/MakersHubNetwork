
import { atom } from 'jotai';
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth.types';

// Define central Jotai atoms for auth state
// These are the single source of truth for all auth state in the app
export const userAtom = atom<User | null>(null);
export const rolesAtom = atom<UserRole[]>([]);
export const isAuthenticatedAtom = atom<boolean>(false);
export const isAdminAtom = atom<boolean>(false);
export const hasAdminAccessAtom = atom<boolean>(false);

// Create derived atoms
export const userNameAtom = atom((get) => {
  const user = get(userAtom);
  return user?.user_metadata?.full_name || user?.email || 'User';
});

export const userAvatarAtom = atom((get) => {
  const user = get(userAtom);
  return user?.user_metadata?.avatar_url || null;
});

// Auth status type definition
export type AuthStatusType = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

// Auth status atom (legacy)
export { isAuthenticatedAtom as authStatusAtom };
