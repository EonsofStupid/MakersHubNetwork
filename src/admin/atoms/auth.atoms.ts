
import { atom } from 'jotai';
import { UserRole } from '@/types/auth.types';

// Auth-related atoms for reactive UI components
export const userAtom = atom<any | null>(null);
export const rolesAtom = atom<UserRole[]>([]);
export const isAuthenticatedAtom = atom<boolean>(false);
export const isAdminAtom = atom<boolean>(false);
export const hasAdminAccessAtom = atom<boolean>(false);

// Derived atoms
export const isSuperAdminAtom = atom(
  (get) => get(rolesAtom).includes('super_admin')
);

// Auth status atom
export const authStatusAtom = atom<'idle' | 'loading' | 'authenticated' | 'unauthenticated'>('idle');
