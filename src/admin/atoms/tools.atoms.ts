
import { atom } from 'jotai';

// Admin edit mode state - component-level state using Jotai
export const adminEditModeAtom = atom<boolean>(false);
export const adminDebugModeAtom = atom<boolean>(false);
export const adminEditTargetAtom = atom<string | null>(null);
export const selectedComponentAtom = atom<string | null>(null);

// Admin sidebar state
export const adminSidebarExpandedAtom = atom<boolean>(true);

// Admin drag and drop state (component-level)
export const adminDragStateAtom = atom<'idle' | 'dragging' | 'hovering'>('idle');
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<'before' | 'after' | 'inside' | null>(null);
export const dragEffectAtom = atom<'move' | 'copy' | null>(null);
export const adminDraggedItemAtom = atom<any | null>(null);
export const adminDropTargetAtom = atom<any | null>(null);

// Admin effects state (component-level)
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);
export const hoveredIconAtom = atom<string | null>(null);

// Frozen zones (elements that cannot be interacted with in edit mode)
export const frozenZonesAtom = atom<string[]>([]);
