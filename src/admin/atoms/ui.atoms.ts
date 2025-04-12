
import { atom } from 'jotai';

// Global UI state atoms
export const isSearchingAtom = atom<boolean>(false);
export const sidebarCollapsedAtom = atom<boolean>(false);
export const pageTitleAtom = atom<string>('Admin Dashboard');
