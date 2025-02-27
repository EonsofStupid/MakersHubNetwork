
import { create } from 'zustand';

interface ContentState {
  selectedContent: string | null;
  setSelectedContent: (id: string | null) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  selectedContent: null,
  setSelectedContent: (id) => set({ selectedContent: id }),
}));
