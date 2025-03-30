
import { atom } from 'jotai';

// UI state atoms
export const sidebarExpandedAtom = atom<boolean>(true);
export const adminPanelVisibleAtom = atom<boolean>(false);
export const activeSectionAtom = atom<string>('overview');
export const activePanelAtom = atom<string | null>(null);
export const panelPositionAtom = atom<{ x: number, y: number }>({ x: 100, y: 100 });

// Modal state atoms
export const modalOpenAtom = atom<boolean>(false);
export const modalContentAtom = atom<React.ReactNode | null>(null);
export const modalTitleAtom = atom<string>('');

// Toast state atoms
export const toastMessageAtom = atom<string | null>(null);
export const toastTypeAtom = atom<'success' | 'error' | 'info' | 'warning'>('info');
export const toastVisibleAtom = atom<boolean>(false);

// Theme atoms
export const themeAtom = atom<'dark' | 'light' | 'system'>('dark');

// Drag and drop related atoms
export const draggableItemsAtom = atom<Record<string, any>>({});
export const dropZonesAtom = atom<string[]>([]);
