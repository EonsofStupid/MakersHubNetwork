import { atom } from 'jotai';
import { AuthBridge } from '@/bridges/AuthBridge';
import { UserProfile, AuthStatus } from '@/types/shared';

/**
 * Read-only atoms derived from auth store
 */

export const userAtom = atom<UserProfile | null>(() => AuthBridge.getUser());

export const authStatusAtom = atom<AuthStatus>(() => AuthBridge.getStatus());

export const isAuthenticatedAtom = atom<boolean>(() => AuthBridge.isAuthenticated());

export const isInitializedAtom = atom<boolean>(() => AuthBridge.isInitialized());

export const isLoadingAtom = atom<boolean>(() => AuthBridge.isLoading());

export const authErrorAtom = atom<Error | null>(() => AuthBridge.getError()); 