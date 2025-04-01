
import { atom } from 'jotai';

// Edit mode state
export const adminEditModeAtom = atom(false);
export const adminDebugModeAtom = atom(false);
export const adminEditTargetAtom = atom<string | null>(null);

// Drag and drop state
export const adminDragStateAtom = atom<'idle' | 'dragging' | 'dropped'>('idle');
export const dragSourceAtom = atom<string | null>(null);
export const dragTargetAtom = atom<string | null>(null);
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<'before' | 'after' | 'inside' | null>(null);
export const dragEffectAtom = atom<'move' | 'copy' | null>(null);

// Frozen zones for edit protection
export const frozenZonesAtom = atom<string[]>([]);

// Selected component state
export const selectedComponentAtom = atom<string | null>(null);

// Effects palette state
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);
export const hoveredIconAtom = atom<string | null>(null);

// Dragged item state
export const adminDraggedItemAtom = atom<any>(null);
export const adminDropTargetAtom = atom<string | null>(null);
