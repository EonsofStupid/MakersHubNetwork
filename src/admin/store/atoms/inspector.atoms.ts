
import { atom } from 'jotai';

export const inspectedComponentAtom = atom<string | null>(null);
export const inspectorTabAtom = atom<string>('styles');
