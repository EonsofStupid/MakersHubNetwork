
import { atom } from 'jotai';
import { FrozenZone } from '../types/tools.types';

// Frozen zones for content editing
export const frozenZonesAtom = atom<FrozenZone[]>([]);

// Effects palette atoms
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);
