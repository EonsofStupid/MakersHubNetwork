
import { atom } from 'jotai';

// Track hover and focus states for UI elements
export const hoveredElementAtom = atom<string | null>(null);
export const focusedElementAtom = atom<string | null>(null);

// Track drag-and-drop operations
export const dragSourceAtom = atom<string | null>(null);
export const dragTargetAtom = atom<string | null>(null);
export const isDraggingAtom = atom<boolean>(false);

// Secondary navigation visibility
export const secondaryNavExpandedAtom = atom<boolean>(true);

// QuickAction bar state
export const pinnedActionsAtom = atom<string[]>(['users', 'builds', 'themes']);
export const quickBarVisibleAtom = atom<boolean>(true);

// Overlay panels state
export const activePanelAtom = atom<string | null>(null);
export const panelPositionAtom = atom<{ x: number, y: number }>({ x: 0, y: 0 });
