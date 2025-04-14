
import { atom } from 'jotai';
import { AuthBridge } from '@/bridges/AuthBridge';
import { UserProfile, AuthStatus } from '@/shared/types/shared.types';

/**
 * Read-only atoms derived from auth store
 */

export const userAtom = atom<UserProfile | null>(() => AuthBridge.getUser());

// For getStatus compatibility
export const authStatusAtom = atom<AuthStatus>((get) => {
  if (!AuthBridge.getUser()) return AuthStatus.UNAUTHENTICATED;
  return AuthBridge.isAuthenticated ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED;
});

export const isAuthenticatedAtom = atom<boolean>(() => !!AuthBridge.isAuthenticated);

export const isInitializedAtom = atom<boolean>(() => true); // Simplified for compatibility

export const isLoadingAtom = atom<boolean>(() => false); // Simplified for compatibility

export const authErrorAtom = atom<Error | null>(() => null); // Simplified for compatibility
