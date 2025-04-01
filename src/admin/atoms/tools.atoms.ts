
import { atom } from 'jotai';

// Edit mode state
export const adminEditModeAtom = atom(false);

// Drag and drop state
export const dragSourceAtom = atom<string | null>(null);
export const dragTargetAtom = atom<string | null>(null);
export const isDraggingAtom = atom<boolean>(false);

// Selected component state
export const selectedComponentAtom = atom<string | null>(null);
