
import { atom } from 'jotai';

// Atom to track edit mode state - shared between components
export const adminEditModeAtom = atom<boolean>(false);

// Sidebar state atoms
export const sidebarExpandedAtom = atom<boolean>(true);
export const showLabelsAtom = atom<boolean>(true);
export const activePageAtom = atom<string>('overview');

// Atom to track current drag operation
export const adminDragSourceAtom = atom<string | null>(null);
export const adminDragTargetAtom = atom<string | null>(null);
export const dragSourceIdAtom = atom<string | null>(null); 
export const dragTargetIdAtom = atom<string | null>(null);
export const isDraggingAtom = atom<boolean>(false);
export const dropIndicatorPositionAtom = atom<{ x: number; y: number } | null>(null);

// Atom for tracking mouse position during drag operations
export const adminMousePositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });

// Atoms for dashboard customization
export const adminDashboardLayoutAtom = atom<string[]>([]);
export const adminFavoriteItemsAtom = atom<string[]>([]);
export const dashboardEditModeAtom = atom<boolean>(false);

// Atoms for theme customization
export const adminThemeAtom = atom<string>('cyber');
export const adminColorSchemeAtom = atom<'dark' | 'light' | 'system'>('dark');
export const darkModeAtom = atom<boolean>(true);
export const selectedThemeAtom = atom<string>('cyberpunk');

// Atom for admin focus mode
export const adminFocusModeAtom = atom<boolean>(false);

// Atom for admin UI density
export const adminUIDensityAtom = atom<'compact' | 'comfortable' | 'spacious'>('comfortable');

// Atoms for UI controls and overlays
export const adminToolsExpandedAtom = atom<boolean>(false);
export const frozenZonesAtom = atom<string[]>([]);
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);
export const searchActiveAtom = atom<boolean>(false);
export const searchQueryAtom = atom<string>('');
export const searchResultsAtom = atom<any[]>([]);
export const adminSettingsOpenAtom = atom<boolean>(false);
export const hoveredIconAtom = atom<string | null>(null);
export const activeModalAtom = atom<string | null>(null);
export const activeOverlayAtom = atom<string | null>(null);
export const dragEffectAtom = atom<string | null>(null);
export const userPreferencesAtom = atom<Record<string, any>>({});
