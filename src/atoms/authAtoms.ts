
import { atom } from 'jotai';
import { AUTH_STATUS, AuthStatus } from '@/shared/types/shared.types';

// We need to reference the enum values directly, not use the type as a value
const authStatusAtom = atom<AuthStatus>(AUTH_STATUS.IDLE);
const isAuthenticatedAtom = atom<boolean>(false);
const isAuthLoadingAtom = atom<boolean>(get => get(authStatusAtom) === AUTH_STATUS.LOADING);

export {
  authStatusAtom,
  isAuthenticatedAtom,
  isAuthLoadingAtom
};
