
import { atom } from 'jotai';

// Drag and drop state atoms
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<{ x: number; y: number } | null>(null);
export const dragEffectAtom = atom<string>('move');

// Edit mode atom
export const adminEditModeAtom = atom<boolean>(false);

// UI state atoms
export const adminSettingsOpenAtom = atom<boolean>(false);
export const hoveredIconAtom = atom<string | null>(null);
export const activeModalAtom = atom<string | null>(null);
export const activeOverlayAtom = atom<string | null>(null);

// Customization atoms
export const selectedThemeAtom = atom<string>('cyberpunk');
export const customThemeAtom = atom<Record<string, string>>({});
export const themeModeAtom = atom<'dark' | 'light'>('dark');

// Admin features
export const adminToolsExpandedAtom = atom<boolean>(false);
export const dashboardEditModeAtom = atom<boolean>(false);
export const userPreferencesAtom = atom<Record<string, any>>({});
