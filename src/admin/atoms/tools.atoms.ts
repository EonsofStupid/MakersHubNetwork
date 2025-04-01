
import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

// Admin edit mode - for customizing layouts and widgets
export const adminEditModeAtom = atomWithStorage('admin-edit-mode', false);

// Admin debug mode - for showing additional debug information
export const adminDebugModeAtom = atomWithStorage('admin-debug-mode', false);

// Admin layout edit target - the current component being edited
export const adminEditTargetAtom = atomWithStorage<string | null>('admin-edit-target', null);

// Admin drag state - for drag and drop functionality
export const adminDragStateAtom = atomWithStorage<{
  isDragging: boolean;
  draggedItem: any | null;
  dropTarget: string | null;
}>('admin-drag-state', {
  isDragging: false,
  draggedItem: null,
  dropTarget: null
});

// Additional atoms used throughout the admin interface
export const sidebarExpandedAtom = atomWithStorage('admin-sidebar-expanded', true);
export const showLabelsAtom = atomWithStorage('admin-show-labels', true);
export const activePageAtom = atom<string>('overview');
export const darkModeAtom = atomWithStorage('admin-dark-mode', true);
export const selectedThemeAtom = atomWithStorage<string>('admin-selected-theme', 'default');
export const adminSettingsOpenAtom = atom<boolean>(false);
export const hoveredIconAtom = atom<string | null>(null);
export const activeModalAtom = atom<string | null>(null);
export const activeOverlayAtom = atom<string | null>(null);
export const adminToolsExpandedAtom = atomWithStorage('admin-tools-expanded', false);
export const dashboardEditModeAtom = atomWithStorage('dashboard-edit-mode', false);
export const userPreferencesAtom = atomWithStorage('user-preferences', {});

// Drag and drop atoms
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<{ x: number; y: number } | null>(null);
export const dragEffectAtom = atom<'move' | 'copy' | null>(null);
export const frozenZonesAtom = atom<string[]>([]);

// Effects and UI state
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);

// Search state
export const searchActiveAtom = atom<boolean>(false);
export const searchQueryAtom = atom<string>('');
export const searchResultsAtom = atom<any[]>([]);
