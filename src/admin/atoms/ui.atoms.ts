
import { atom } from 'jotai';

// UI state atoms
export const sidebarWidthAtom = atom<number>(240);
export const contentWidthAtom = atom<number>(0);
export const showNotificationsAtom = atom<boolean>(false);
export const modalOpenAtom = atom<boolean>(false);
export const currentModalAtom = atom<string | null>(null);
export const adminActionAtom = atom<string | null>(null);
export const isMobileAtom = atom<boolean>(false);
export const showQuickBarAtom = atom<boolean>(false);

// UI appearance atoms
export const uiScaleAtom = atom<number>(1);
export const fontSizeAtom = atom<number>(16);
export const reducedMotionAtom = atom<boolean>(false);
export const highContrastAtom = atom<boolean>(false);
export const uiDensityAtom = atom<'compact' | 'comfortable' | 'spacious'>('comfortable');

// Layout atoms
export const layoutGridAtom = atom<boolean>(false);
export const showGridAtom = atom<boolean>(false);
export const gridSizeAtom = atom<number>(8);
export const snapToGridAtom = atom<boolean>(false);

// Color scheme atoms
export const primaryColorAtom = atom<string>('#00F0FF');
export const secondaryColorAtom = atom<string>('#FF2D6E');
export const accentColorAtom = atom<string>('#F97316');
export const backgroundColorAtom = atom<string>('#12121A');

// Dynamic layout atoms
export const activeColumnsAtom = atom<number>(12);
export const activePanelSizeAtom = atom<Record<string, number>>({});
export const panelSnapPositionsAtom = atom<Record<string, { x: number, y: number }>>({});
