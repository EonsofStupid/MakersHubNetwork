
import { atom } from 'jotai';

/**
 * Atom for admin edit mode state
 */
export const adminEditModeAtom = atom<boolean>(false);

/**
 * Atom for admin dev mode state
 */
export const adminDevModeAtom = atom<boolean>(
  process.env.NODE_ENV === 'development'
);

/**
 * Atom for admin debug mode state
 */
export const adminDebugModeAtom = atom<boolean>(false);
