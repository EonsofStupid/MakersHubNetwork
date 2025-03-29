
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReviewCategory, ReviewDraft, ReviewRating } from "../types/review.types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewDraftState {
  draft: Partial<ReviewDraft>;
  isSubmitting: boolean;
  error: string | null;
}

interface ReviewDraftActions {
  setDraft: (draft: Partial<ReviewDraft>) => void;
  resetDraft: () => void;
  setRating: (rating: ReviewRating) => void;
  setTitle: (title: string) => void;
  setBody: (body: string) => void;
  addCategory: (category: ReviewCategory) => void;
  removeCategory: (category: ReviewCategory) => void;
  addImageUrl: (url: string) => void;
  removeImageUrl: (url: string) => void;
  submitReview: () => Promise<boolean>;
}

type ReviewDraftStore = ReviewDraftState & ReviewDraftActions;

export const useReviewDraftStore = create<ReviewDraftStore>()(
  persist(
    (set, get) => ({
      draft: {},
      isSubmitting: false,
      error: null,

      setDraft: (draft) => set({ draft: { ...get().draft, ...draft } }),
      
      resetDraft: () => set({ draft: {}, error: null }),
      
      setRating: (rating) => set({ draft: { ...get().draft, rating } }),
      
      setTitle: (title) => set({ draft: { ...get().draft, title } }),
      
      setBody: (body) => set({ draft: { ...get().draft, body } }),
      
      addCategory: (category) => {
        const currentCategories = get().draft.categories || [];
        if (!currentCategories.includes(category)) {
          set({
            draft: {
              ...get().draft,
              categories: [...currentCategories, category]
            }
          });
        }
      },
      
      removeCategory: (category) => {
        const currentCategories = get().draft.categories || [];
        set({
          draft: {
            ...get().draft,
            categories: currentCategories.filter(c => c !== category)
          }
        });
      },
      
      addImageUrl: (url) => {
        const currentUrls = get().draft.imageUrls || [];
        set({
          draft: {
            ...get().draft,
            imageUrls: [...currentUrls, url]
          }
        });
      },
      
      removeImageUrl: (url) => {
        const currentUrls = get().draft.imageUrls || [];
        set({
          draft: {
            ...get().draft,
            imageUrls: currentUrls.filter(u => u !== url)
          }
        });
      },
      
      submitReview: async () => {
        const { draft } = get();
        
        // Validate the draft
        if (!draft.buildId) {
          set({ error: "Build ID is required" });
          return false;
        }
        
        if (!draft.rating) {
          set({ error: "Rating is required" });
          return false;
        }
        
        if (!draft.title || draft.title.trim() === '') {
          set({ error: "Title is required" });
          return false;
        }
        
        if (!draft.body || draft.body.trim() === '') {
          set({ error: "Review content is required" });
          return false;
        }
        
        try {
          set({ isSubmitting: true, error: null });
          
          // Get the current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            set({ error: "You must be logged in to submit a review", isSubmitting: false });
            return false;
          }
          
          // Submit the review
          const { error } = await supabase
            .from('build_reviews')
            .insert({
              build_id: draft.buildId,
              user_id: user.id,
              rating: draft.rating,
              title: draft.title,
              body: draft.body,
              category: draft.categories || [],
              image_urls: draft.imageUrls || []
            });
          
          if (error) throw error;
          
          toast.success("Review submitted successfully and is awaiting approval");
          
          // Reset the draft after successful submission
          set({ draft: {}, isSubmitting: false });
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to submit review';
          set({ error: errorMessage, isSubmitting: false });
          toast.error(errorMessage);
          return false;
        }
      }
    }),
    {
      name: "review-draft-storage",
      partialize: (state) => ({ draft: state.draft })
    }
  )
);
