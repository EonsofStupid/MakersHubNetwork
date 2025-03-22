
import { atom } from 'jotai';

// For tracking which icon is currently being hovered
export const hoveredIconAtom = atom<string | null>(null);

// For showing drag overlay during drag and drop operations
export const showDragOverlayAtom = atom<boolean>(false);

// For tracking drag source and target during drag operations
export const dragSourceAtom = atom<string | null>(null);
export const dragTargetAtom = atom<string | null>(null);

// For tracking animation states
export const animationStateAtom = atom<'idle' | 'active' | 'loading'>('idle');
