
import { create } from 'zustand';
import { HomeLayout, FallbackLayout } from '../schema/homeLayoutSchema';
import type { SectionType } from '../schema/homeLayoutSchema';

interface HomeStoreState {
  // Layout configuration
  layout: HomeLayout;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setLayout: (layout: HomeLayout) => void;
  updateSectionOrder: (sectionOrder: SectionType[]) => void;
  setFeaturedOverride: (postId: string | null) => void;
  resetToFallback: () => void;
}

export const useHomeStore = create<HomeStoreState>((set) => ({
  // Initial state
  layout: FallbackLayout,
  isLoading: true,
  error: null,
  
  // Actions
  setLayout: (layout: HomeLayout) => set({ layout, isLoading: false }),
  
  updateSectionOrder: (sectionOrder: SectionType[]) => 
    set(state => ({
      layout: {
        ...state.layout,
        section_order: sectionOrder
      }
    })),
  
  setFeaturedOverride: (postId: string | null) => 
    set(state => ({
      layout: {
        ...state.layout,
        featured_override: postId
      }
    })),
  
  resetToFallback: () => set({ layout: FallbackLayout })
}));
