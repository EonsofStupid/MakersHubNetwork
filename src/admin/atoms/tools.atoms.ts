
import { atom } from 'jotai';

// Controls the admin edit mode
export const adminEditModeAtom = atom<boolean>(false);

// Controls the admin debug mode
export const adminDebugModeAtom = atom<boolean>(false);

// Controls the admin sidebar expansion state
export const adminSidebarExpandedAtom = atom<boolean>(true);

// Controls the admin toast notifications
export const adminNotificationsEnabledAtom = atom<boolean>(true);

// Controls the admin theme
export const adminThemeModeAtom = atom<'light' | 'dark' | 'system'>('dark');

// Drag and drop atoms
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<'top' | 'bottom' | 'none'>('none');
export const dragEffectAtom = atom<'move' | 'copy' | 'none'>('none');
export const adminDraggedItemAtom = atom<any | null>(null);
export const adminDropTargetAtom = atom<any | null>(null);
export const adminEditTargetAtom = atom<string | null>(null);
export const adminDragStateAtom = atom<'idle' | 'dragging' | 'dropping'>('idle');

// Effects atoms
export const frozenZonesAtom = atom<string[]>([]);
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);
export const hoveredIconAtom = atom<string | null>(null);

// Admin UI preferences
export const adminPreferencesAtom = atom<{
  dashboardLayout: string;
  defaultView: 'grid' | 'list' | 'table';
  compactMode: boolean;
  sidebarCollapsed: boolean;
}>({
  dashboardLayout: 'default',
  defaultView: 'grid',
  compactMode: false,
  sidebarCollapsed: false
});

