
import { atom } from 'jotai';

// UI state atoms
export const adminEditModeAtom = atom<boolean>(false);
export const sidebarExpandedAtom = atom<boolean>(true);
export const showLabelsAtom = atom<boolean>(true);
export const activePageAtom = atom<string>('dashboard');

// Drag and drop atoms
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<{ x: number; y: number } | null>(null);

// Theme atoms
export const darkModeAtom = atom<boolean>(false);
export const selectedThemeAtom = atom<string>('cyberpunk');
