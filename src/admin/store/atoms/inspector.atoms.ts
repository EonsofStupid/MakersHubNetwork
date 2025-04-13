
import { atom } from 'jotai';

// Atom for the currently inspected component
export const inspectedComponentAtom = atom<string | null>(null);

// Atom for the inspector tab (styles, props, state)
export const inspectorTabAtom = atom<'styles' | 'props' | 'state'>('styles');

// Atom for the inspector visibility
export const inspectorVisibleAtom = atom<boolean>(false);

// Atom for the inspector position
export const inspectorPositionAtom = atom<{ x: number, y: number } | null>(null);
