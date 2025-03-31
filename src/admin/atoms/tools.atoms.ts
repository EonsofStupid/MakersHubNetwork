
import { atom } from 'jotai';
import { AdminNavigationItem } from '@/admin/config/navigation.config';
import { FrozenZone, CyberEffect } from '@/admin/types/tools.types';
import type { AdminPreferences } from '@/admin/types/admin.types';

// Navigation & UI state
export const adminEditModeAtom = atom<boolean>(false);
export const sidebarExpandedAtom = atom<boolean>(true);
export const showLabelsAtom = atom<boolean>(true);
export const activePageAtom = atom<string>('');
export const darkModeAtom = atom<boolean>(true);
export const selectedThemeAtom = atom<string>('impulse-cyber');
export const adminSettingsOpenAtom = atom<boolean>(false);
export const hoveredIconAtom = atom<string | null>(null);
export const activeModalAtom = atom<string | null>(null);
export const activeOverlayAtom = atom<string | null>(null);
export const adminToolsExpandedAtom = atom<boolean>(false);
export const dashboardEditModeAtom = atom<boolean>(false);
export const userPreferencesAtom = atom<AdminPreferences | null>(null);

// Drag and drop state
export const isDraggingAtom = atom<boolean>(false);
export const dragSourceIdAtom = atom<string | null>(null);
export const dragTargetIdAtom = atom<string | null>(null);
export const dropIndicatorPositionAtom = atom<{ x: number, y: number } | null>(null);
export const dragEffectAtom = atom<string>('move');

// Frozen zones & effects
export const frozenZonesAtom = atom<FrozenZone[]>([]);
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<CyberEffect | null>(null);

// Search
export const searchActiveAtom = atom<boolean>(false);
export const searchQueryAtom = atom<string>('');
export const searchResultsAtom = atom<AdminNavigationItem[]>([]);
