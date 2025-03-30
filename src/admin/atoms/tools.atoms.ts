
import { atom } from 'jotai';

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
