
import { atom } from 'jotai';

// Re-export atoms from ui.atoms
export * from './ui.atoms';

// Re-export specific atoms from tools.atoms
export {
  adminEditModeAtom,
  adminDebugModeAtom,
  adminEditTargetAtom,
  adminDragStateAtom,
  isDraggingAtom,
  dragSourceIdAtom,
  dragTargetIdAtom,
  dropIndicatorPositionAtom,
  dragEffectAtom,
  frozenZonesAtom,
  effectsPaletteVisibleAtom,
  selectedEffectAtom,
  hoveredIconAtom,
  adminDraggedItemAtom,
  adminDropTargetAtom
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

