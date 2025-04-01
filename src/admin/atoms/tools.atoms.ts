
import { atomWithStorage } from 'jotai/utils';

// Admin edit mode - for customizing layouts and widgets
export const adminEditModeAtom = atomWithStorage('admin-edit-mode', false);

// Admin debug mode - for showing additional debug information
export const adminDebugModeAtom = atomWithStorage('admin-debug-mode', false);

// Admin layout edit target - the current component being edited
export const adminEditTargetAtom = atomWithStorage<string | null>('admin-edit-target', null);

// Admin drag state - for drag and drop functionality
export const adminDragStateAtom = atomWithStorage<{
  isDragging: boolean;
  draggedItem: any | null;
  dropTarget: string | null;
}>('admin-drag-state', {
  isDragging: false,
  draggedItem: null,
  dropTarget: null
});
