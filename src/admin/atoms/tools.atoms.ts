
import { atom } from 'jotai';

// Atom for admin edit mode
export const adminEditModeAtom = atom<boolean>(false);

// Atom for admin sidebar expanded state
export const adminSidebarExpandedAtom = atom<boolean>(true);

// Atom for admin dashboard collapsed state
export const adminDashboardCollapsedAtom = atom<boolean>(false);

// Atom for currently dragged item
export const adminDraggedItemAtom = atom<{
  id: string;
  type: 'nav' | 'dashboard' | 'widget';
  data: any;
} | null>(null);

// Atom for drop target area
export const adminDropTargetAtom = atom<{
  id: string;
  type: 'topnav' | 'dashboard' | 'sidebar';
} | null>(null);
