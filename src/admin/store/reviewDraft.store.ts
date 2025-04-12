
import { create } from 'zustand';
import { ReviewDraft, ReviewRating } from '@/shared/types/shared.types';

interface ReviewDraftState {
  draft: Partial<ReviewDraft>;
  isDirty: boolean;
  
  // Actions
  setRating: (rating: number) => void;
  setContent: (content: string) => void;
  setBuildId: (buildId: string) => void;
  setProductId: (productId: string) => void;
  toggleCategory: (category: string) => void;
  addImageUrl: (url: string) => void;
  removeImageUrl: (url: string) => void;
  resetDraft: () => void;
  setDraft: (draft: Partial<ReviewDraft>) => void;
  
  // Submit handlers
  canSubmit: () => boolean;
  prepareDraftForSubmission: () => ReviewDraft | null;
}

// Initial empty draft
const INITIAL_STATE: Partial<ReviewDraft> = {
  content: '',
  rating: 0 as ReviewRating,
  categories: [],
  image_urls: []
};

export const useReviewDraftStore = create<ReviewDraftState>((set, get) => ({
  draft: { ...INITIAL_STATE },
  isDirty: false,
  
  setRating: (rating) => {
    set(state => ({
      draft: { ...state.draft, rating: rating as ReviewRating },
      isDirty: true
    }));
  },
  
  setContent: (content) => {
    set(state => ({
      draft: { ...state.draft, content },
      isDirty: true
    }));
  },
  
  setBuildId: (buildId) => {
    set(state => ({
      draft: { ...state.draft, build_id: buildId },
      isDirty: true
    }));
  },
  
  setProductId: (productId) => {
    set(state => ({
      draft: { ...state.draft, product_id: productId },
      isDirty: true
    }));
  },
  
  toggleCategory: (category) => {
    set(state => {
      const categories = state.draft.categories || [];
      const newCategories = categories.includes(category)
        ? categories.filter(c => c !== category)
        : [...categories, category];
      
      return {
        draft: { ...state.draft, categories: newCategories },
        isDirty: true
      };
    });
  },
  
  addImageUrl: (url) => {
    set(state => {
      const imageUrls = state.draft.image_urls || [];
      return {
        draft: { ...state.draft, image_urls: [...imageUrls, url] },
        isDirty: true
      };
    });
  },
  
  removeImageUrl: (url) => {
    set(state => {
      const imageUrls = state.draft.image_urls || [];
      return {
        draft: { ...state.draft, image_urls: imageUrls.filter(imgUrl => imgUrl !== url) },
        isDirty: true
      };
    });
  },
  
  resetDraft: () => {
    set({
      draft: { ...INITIAL_STATE },
      isDirty: false
    });
  },
  
  setDraft: (draft) => {
    set({
      draft,
      isDirty: true
    });
  },
  
  canSubmit: () => {
    const { draft } = get();
    return (
      (!!draft.build_id || !!draft.product_id) &&
      (draft.rating as number) > 0 &&
      !!draft.content &&
      draft.content.length >= 10 &&
      (draft.categories?.length ?? 0) > 0
    );
  },
  
  prepareDraftForSubmission: () => {
    const { draft, canSubmit } = get();
    
    if (!canSubmit()) {
      return null;
    }
    
    // Ensure the draft has all required fields
    // If we're missing required fields, return null
    if (!draft.content || !draft.rating || !draft.categories) {
      return null;
    }
    
    return {
      build_id: draft.build_id,
      product_id: draft.product_id,
      rating: draft.rating,
      content: draft.content,
      categories: draft.categories,
      image_urls: draft.image_urls
    } as ReviewDraft;
  }
}));
