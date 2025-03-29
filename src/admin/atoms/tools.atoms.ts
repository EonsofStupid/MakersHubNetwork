
import { atom } from 'jotai';
import { FrozenZone } from '../types/tools.types';

// Frozen zones for content editing
export const frozenZonesAtom = atom<FrozenZone[]>([]);

// Drag and drop functionality for admin UI
export const dragSourceAtom = atom<string | null>(null);
export const showDragOverlayAtom = atom<boolean>(false);
export const hoveredIconAtom = atom<string | null>(null);

// Effects palette atoms
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);
