import { create } from 'zustand';

export type Platform = 'desktop' | 'mobile';

interface PlatformState {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  platform: 'desktop',
  setPlatform: (platform) => set({ platform }),
}));

export const detectPlatform = (): Platform => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
  return isMobile ? 'mobile' : 'desktop';
};