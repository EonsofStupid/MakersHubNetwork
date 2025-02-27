
import { create } from 'zustand';

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
}

interface GalleryState {
  assets: MediaAsset[];
  selectedAsset: string | null;
  setAssets: (assets: MediaAsset[]) => void;
  setSelectedAsset: (id: string | null) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  assets: [],
  selectedAsset: null,
  setAssets: (assets) => set({ assets }),
  setSelectedAsset: (id) => set({ selectedAsset: id }),
}));
