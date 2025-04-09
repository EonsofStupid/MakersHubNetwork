
import { atom } from 'jotai';
import { hasAdminAccessAtom } from './auth.atoms';

// UI visibility state
export const mainNavHiddenAtom = atom<boolean>(false);
export const iconOnlyModeAtom = atom<boolean>(false);
export const aiPanelVisibleAtom = atom<boolean>(false);
export const effectsPanelVisibleAtom = atom<boolean>(false);
export const recordingAtom = atom<boolean>(false);
export const frozenZonesAtom = atom<string[]>([]);

// Admin UI visibility - derived from auth state
export const showAdminButtonAtom = atom(
  (get) => get(hasAdminAccessAtom)
);

export const showAdminWrenchAtom = atom(
  (get) => get(hasAdminAccessAtom)
);

// Search state
export const isSearchingAtom = atom<boolean>(false);

// Quick bar state
export const quickBarItemsAtom = atom<string[]>(["Users", "Roles", "Themes", "Settings"]);

// Drag and drop atoms
export const dragSourceAtom = atom<string | null>(null);
export const showDragOverlayAtom = atom<boolean>(false);
export const hoveredIconAtom = atom<string | null>(null);

// Panel and overlay atoms
export const activePanelAtom = atom<string | null>(null);
export const panelPositionAtom = atom<{ x: number, y: number }>({ x: 0, y: 0 });
