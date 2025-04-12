
import { atom } from 'jotai';

// Global UI state atoms
export const isSearchingAtom = atom<boolean>(false);
export const sidebarCollapsedAtom = atom<boolean>(false);
export const pageTitleAtom = atom<string>('Admin Dashboard');
export const showAdminButtonAtom = atom<boolean>(true);
export const showAdminWrenchAtom = atom<boolean>(true);
export const activePanelAtom = atom<string | null>(null);
export const panelPositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });
