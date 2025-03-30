
import { atom } from 'jotai';
import { FrozenZone, CyberEffect, AdminNotification, DragAndDropItem } from '@/admin/types/tools.types';

// UI state atoms
export const adminEditModeAtom = atom<boolean>(false);
export const sidebarExpandedAtom = atom<boolean>(true);
export const showLabelsAtom = atom<boolean>(true);
export const activePageAtom = atom<string>('dashboard');
export const activeToolAtom = atom<string | null>(null);
export const toolsVisibleAtom = atom<boolean>(false);
export const settingsOpenAtom = atom<boolean>(false);
export const activeSettingsCategoryAtom = atom<string>('general');
export const importDialogVisibleAtom = atom<boolean>(false);
export const exportDialogVisibleAtom = atom<boolean>(false);
export const searchActiveAtom = atom<boolean>(false);
export const searchQueryAtom = atom<string>('');
export const searchResultsAtom = atom<any[]>([]);
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);
export const frozenZonesAtom = atom<FrozenZone[]>([]);

// Drag and drop atoms
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<{ x: number; y: number } | null>(null);

// Theme atoms
export const darkModeAtom = atom<boolean>(false);
export const selectedThemeAtom = atom<string>('cyberpunk');

// Effect atoms
export const cyberEffectVariantsAtom = atom<string[]>([
  'pulse',
  'glitch',
  'data-stream',
  'energy-wave',
  'matrix-rain'
]);

export const cyberColorVariantsAtom = atom<string[]>([
  'var(--impulse-primary)',
  '#FF2D6E',
  '#7B61FF',
  '#00FFAA'
]);
