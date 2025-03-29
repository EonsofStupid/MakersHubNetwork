
import { atom } from 'jotai';

// UI visibility state
export const mainNavHiddenAtom = atom<boolean>(false);
export const iconOnlyModeAtom = atom<boolean>(false);
export const aiPanelVisibleAtom = atom<boolean>(false);
export const effectsPanelVisibleAtom = atom<boolean>(false);
export const recordingAtom = atom<boolean>(false);
export const frozenZonesAtom = atom<string[]>([]);

// Active panel management
export const activePanelAtom = atom<string | null>(null);
export const panelPositionAtom = atom<{ x: number, y: number }>({ x: 0, y: 0 });

// Admin UI state
export const adminSidebarExpandedAtom = atom<boolean>(true);
export const adminScrollPositionAtom = atom<number>(0);
export const adminActiveSectionAtom = atom<string>('overview');

// Admin theme preferences
export const adminThemeModeAtom = atom<'light' | 'dark' | 'system'>('dark');
export const adminAccentColorAtom = atom<string>('#00F0FF');

// Quick bar state
export const quickBarItemsAtom = atom<string[]>(["Users", "Roles", "Themes", "Settings"]);

// Drag and drop atoms
export const dragSourceAtom = atom<string | null>(null);
export const dragTargetAtom = atom<string | null>(null);
export const showDragOverlayAtom = atom<boolean>(false);
export const hoveredIconAtom = atom<string | null>(null);

// Animation states
export const animationStateAtom = atom<'idle' | 'active' | 'loading'>('idle');

// QuickActionBar atoms
export const pinnedActionsAtom = atom<string[]>(['users', 'builds', 'themes', 'settings']);
