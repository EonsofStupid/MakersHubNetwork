
import { atom } from 'jotai';
import { Layout } from '@/admin/types/layout.types';

// Current selected layout being edited
export const currentLayoutAtom = atom<Layout | null>(null);

// Layout edit history for undo/redo functionality
export const layoutHistoryAtom = atom<Layout[]>([]);
export const layoutHistoryIndexAtom = atom<number>(-1);

// Selected component in the editor
export const selectedComponentIdAtom = atom<string | null>(null);

// Component properties panel state
export const showPropertiesPanelAtom = atom<boolean>(false);
