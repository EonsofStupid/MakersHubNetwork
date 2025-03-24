
import { atom } from 'jotai';

// Inspector state
export const inspectorVisibleAtom = atom<boolean>(false);
export const inspectorPositionAtom = atom<{ x: number, y: number }>({ x: 0, y: 0 });
export const inspectorComponentAtom = atom<string | null>(null);
export const inspectorTabAtom = atom<'styles' | 'data' | 'rules'>('styles');

// Alt key tracking for inspector
export const altKeyPressedAtom = atom<boolean>(false);
