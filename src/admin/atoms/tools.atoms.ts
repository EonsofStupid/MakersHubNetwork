
import { atom } from 'jotai';

// Drag and drop state atoms
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<{ x: number; y: number } | null>(null);
export const dragEffectAtom = atom<string>('move');

// UI visibility state atoms
export const adminEditModeAtom = atom<boolean>(false);
export const adminSettingsOpenAtom = atom<boolean>(false);
export const hoveredIconAtom = atom<string | null>(null);
export const activeModalAtom = atom<string | null>(null);
export const activeOverlayAtom = atom<string | null>(null);

// Navigation state atoms
export const sidebarExpandedAtom = atom<boolean>(true);
export const showLabelsAtom = atom<boolean>(true);
export const activePageAtom = atom<string>('overview');

// Customization atoms
export const selectedThemeAtom = atom<string>('cyberpunk');
export const customThemeAtom = atom<Record<string, string>>({});
export const themeModeAtom = atom<'dark' | 'light'>('dark');
export const darkModeAtom = atom<boolean>(false);

// Admin features
export const adminToolsExpandedAtom = atom<boolean>(false);
export const dashboardEditModeAtom = atom<boolean>(false);
export const userPreferencesAtom = atom<Record<string, any>>({});

// Frozen zones and effects
export const frozenZonesAtom = atom<string[]>([]);
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);

// Search atoms
export const searchActiveAtom = atom<boolean>(false);
export const searchQueryAtom = atom<string>('');
export const searchResultsAtom = atom<any[]>([]);
