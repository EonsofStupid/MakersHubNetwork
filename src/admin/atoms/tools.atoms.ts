
import { atom } from 'jotai';

// Atom to track edit mode state - shared between components
export const adminEditModeAtom = atom<boolean>(false);

// Atom to track current drag operation
export const adminDragSourceAtom = atom<string | null>(null);
export const adminDragTargetAtom = atom<string | null>(null);

// Atom for tracking mouse position during drag operations
export const adminMousePositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });

// Atoms for dashboard customization
export const adminDashboardLayoutAtom = atom<string[]>([]);
export const adminFavoriteItemsAtom = atom<string[]>([]);

// Atoms for theme customization
export const adminThemeAtom = atom<string>('cyber');
export const adminColorSchemeAtom = atom<'dark' | 'light' | 'system'>('dark');

// Atom for admin focus mode
export const adminFocusModeAtom = atom<boolean>(false);

// Atom for admin UI density
export const adminUIDensityAtom = atom<'compact' | 'comfortable' | 'spacious'>('comfortable');
