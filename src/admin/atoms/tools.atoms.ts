
import { atom } from 'jotai';
import { FrozenZone } from "@/admin/types/tools.types";

// Tool drawer state
export const activeToolAtom = atom<string | null>(null);
export const toolsVisibleAtom = atom<boolean>(false);

// Settings state
export const settingsOpenAtom = atom<boolean>(false);
export const activeSettingsCategoryAtom = atom<string>('general');

// Import/Export tool state
export const importDialogVisibleAtom = atom<boolean>(false);
export const exportDialogVisibleAtom = atom<boolean>(false);

// Search state
export const searchActiveAtom = atom<boolean>(false);
export const searchQueryAtom = atom<string>('');
export const searchResultsAtom = atom<any[]>([]);

// Effects palette state
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);

// Frozen zones state
export const frozenZonesAtom = atom<FrozenZone[]>([]);

// Admin edit mode - moved from index.ts to avoid duplicate exports
export const adminEditModeAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const isDraggingAtom = atom<boolean>(false);
export const dropIndicatorPositionAtom = atom<{ x: number, y: number } | null>(null);
