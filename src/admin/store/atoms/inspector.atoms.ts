
import { atom } from 'jotai';

export const inspectedComponentAtom = atom<string | null>(null);
export const inspectorTabAtom = atom<string>('styles');
export const inspectorVisibleAtom = atom<boolean>(false);
export const inspectorPositionAtom = atom<{ x: number, y: number } | null>(null);
export const inspectorComponentAtom = atom<{
  id: string,
  name: string,
  type: string,
  props: Record<string, any>
} | null>(null);
