
import { atom } from 'jotai';

// Smart overlay state
export const hoveredComponentAtom = atom<string | null>(null);
export const selectedComponentAtom = atom<string | null>(null);
export const activeOverlaysAtom = atom<Record<string, boolean>>({});
