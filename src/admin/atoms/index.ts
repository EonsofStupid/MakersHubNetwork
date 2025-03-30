
import { atom } from 'jotai';

// Re-export atoms from ui.atoms
export * from './ui.atoms';

// Re-export atoms from tools.atoms (with renamed drag atoms to avoid conflicts)
export {
  activeToolAtom,
  toolsVisibleAtom,
  settingsOpenAtom,
  activeSettingsCategoryAtom,
  importDialogVisibleAtom,
  exportDialogVisibleAtom,
  searchActiveAtom,
  searchQueryAtom,
  searchResultsAtom,
  effectsPaletteVisibleAtom,
  selectedEffectAtom,
  frozenZonesAtom,
  adminEditModeAtom,
  dragSourceIdAtom,
  dragTargetIdAtom,
  isDraggingAtom,
  dropIndicatorPositionAtom
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
