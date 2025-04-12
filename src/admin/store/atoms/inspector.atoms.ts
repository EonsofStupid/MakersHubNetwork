
import { atom } from 'jotai';

// Debugging and inspection atoms
export const inspectorVisibleAtom = atom<boolean>(false);
export const inspectedComponentAtom = atom<string | null>(null);
export const inspectorPositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });
export const inspectorModeAtom = atom<'normal' | 'detailed' | 'code'>('normal');

// Component selection atom
export const selectedElementAtom = atom<HTMLElement | null>(null);
