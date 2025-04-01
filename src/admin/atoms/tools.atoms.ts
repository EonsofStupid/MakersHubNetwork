
import { atom } from 'jotai';

// Admin UI
export const adminEditModeAtom = atom<boolean>(false);
export const sidebarExpandedAtom = atom<boolean>(true);
export const showLabelsAtom = atom<boolean>(true);
export const activePageAtom = atom<string>('overview');
export const darkModeAtom = atom<boolean>(false);
export const selectedThemeAtom = atom<string>('cyberpunk');
export const adminSettingsOpenAtom = atom<boolean>(false);

// Hover and active states
export const hoveredIconAtom = atom<string | null>(null);
export const activeModalAtom = atom<string | null>(null);
export const activeOverlayAtom = atom<string | null>(null);
export const adminToolsExpandedAtom = atom<boolean>(false);
export const dashboardEditModeAtom = atom<boolean>(false);

// User preferences
export const userPreferencesAtom = atom<Record<string, any>>({});

// Drag and Drop
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<{ x: number; y: number } | null>(null);
export const dragEffectAtom = atom<"move" | "copy" | "link" | "none">("move");

// Admin layout
export const frozenZonesAtom = atom<string[]>([]);
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);

// Search
export const searchActiveAtom = atom<boolean>(false);
export const searchQueryAtom = atom<string>('');
export const searchResultsAtom = atom<any[]>([]);
