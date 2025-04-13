
import { create } from 'zustand';
import { ReviewDraft } from '@/shared/types/review.types';

interface ReviewDraftState {
  draft: ReviewDraft;
  isDirty: boolean;
  
  // Actions
  setRating: (rating: number) => void;
  setContent: (content: string) => void;
  setCategories: (categories: string[]) => void;
  setBuildId: (buildId?: string) => void;
  setProductId: (productId?: string) => void;
  addImageUrl: (url: string) => void;
  removeImageUrl: (url: string) => void;
  resetDraft: () => void;
}

const DEFAULT_DRAFT: ReviewDraft = {
  rating: 0,
  content: '',
  categories: [],
  image_urls: []
};

export const useReviewDraftStore = create<ReviewDraftState>((set) => ({
  draft: { ...DEFAULT_DRAFT },
  isDirty: false,
  
  setRating: (rating: number) => set(state => ({ 
    draft: { 
      ...state.draft, 
      rating 
    }, 
    isDirty: true 
  })),
  
  setContent: (content: string) => set(state => ({ 
    draft: { ...state.draft, content }, 
    isDirty: true 
  })),
  
  setCategories: (categories: string[]) => set(state => ({ 
    draft: { ...state.draft, categories }, 
    isDirty: true 
  })),
  
  setBuildId: (build_id?: string) => set(state => ({ 
    draft: { ...state.draft, build_id }, 
    isDirty: true 
  })),
  
  setProductId: (product_id?: string) => set(state => ({ 
    draft: { ...state.draft, product_id }, 
    isDirty: true 
  })),
  
  addImageUrl: (url: string) => set(state => {
    const image_urls = [...(state.draft.image_urls || []), url];
    return { 
      draft: { ...state.draft, image_urls }, 
      isDirty: true 
    };
  }),
  
  removeImageUrl: (url: string) => set(state => {
    const image_urls = (state.draft.image_urls || []).filter(u => u !== url);
    return { 
      draft: { ...state.draft, image_urls }, 
      isDirty: true 
    };
  }),
  
  resetDraft: () => set({ draft: { ...DEFAULT_DRAFT }, isDirty: false }),
}));
