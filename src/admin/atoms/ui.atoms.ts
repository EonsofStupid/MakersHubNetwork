
import { atom } from 'jotai';

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

// QuickActionBar atoms
export const pinnedActionsAtom = atom<string[]>(['users', 'builds', 'themes', 'settings']);
export const dragTargetAtom = atom<string | null>(null);
