
import { atom } from 'jotai';

// Admin edit mode for layout editor
export const adminEditModeAtom = atom<boolean>(false);

// Selected component in inspector
export const selectedComponentIdAtom = atom<string | null>(null);

// Debug overlay visibility
export const debugOverlayVisibleAtom = atom<boolean>(false);

// Layout editing state
export const activeLayoutEditorAtom = atom<{
  id: string;
  name: string;
  isEditing: boolean;
} | null>(null);

// Component inspector state
export const inspectorPanelOpenAtom = atom<boolean>(false);

// Admin sidebar state
export const adminSidebarExpandedAtom = atom<boolean>(true);
