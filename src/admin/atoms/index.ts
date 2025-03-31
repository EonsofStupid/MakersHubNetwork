
import { atom } from 'jotai';

// Re-export atoms from ui.atoms
export * from './ui.atoms';

// Re-export atoms from tools.atoms with the correct names
export {
  adminEditModeAtom,
  sidebarExpandedAtom,
  showLabelsAtom,
  activePageAtom,
  darkModeAtom,
  selectedThemeAtom,
  adminSettingsOpenAtom,
  hoveredIconAtom,
  activeModalAtom,
  activeOverlayAtom,
  adminToolsExpandedAtom,
  dashboardEditModeAtom,
  userPreferencesAtom,
  isDraggingAtom,
  dragSourceIdAtom,
  dragTargetIdAtom,
  dropIndicatorPositionAtom,
  dragEffectAtom,
  frozenZonesAtom,
  effectsPaletteVisibleAtom,
  selectedEffectAtom,
  searchActiveAtom,
  searchQueryAtom,
  searchResultsAtom
} from './tools.atoms';

// Export additional cyberpunk effects atoms
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
