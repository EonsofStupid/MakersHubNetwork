
import { atom } from 'jotai';

// UI state atoms
export const adminEditModeAtom = atom<boolean>(false);
export const adminDebugModeAtom = atom<boolean>(false);
export const adminEditTargetAtom = atom<string | null>(null);
export const adminSidebarExpandedAtom = atom<boolean>(true);

// Drag and drop atoms
export const adminDragStateAtom = atom<'idle' | 'dragging' | 'dropping'>('idle');
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<'before' | 'after' | 'inside' | null>(null);
export const dragEffectAtom = atom<'copy' | 'move' | 'link' | 'none'>('move');

// Layout atoms
export const frozenZonesAtom = atom<string[]>([]);
export const selectedComponentAtom = atom<string | null>(null);

// Effects atoms
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);

// Admin navigation atoms
export const hoveredIconAtom = atom<string | null>(null);

// Specific drag items
export const adminDraggedItemAtom = atom<any | null>(null);
export const adminDropTargetAtom = atom<any | null>(null);
