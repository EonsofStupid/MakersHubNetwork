
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { 
  ReviewAdminStore, 
  BuildReview, 
  ReviewStats, 
  ReviewCategory, 
  ReviewRating 
} from "../types/review.types";
import { toast } from "sonner";

export const useReviewAdminStore = create<ReviewAdminStore>((set, get) => ({
  reviews: [],
  pendingReviews: [],
  selectedReview: null,
  stats: null,
  filters: {
    sortBy: 'newest',
    approvedOnly: false,
  },
  isLoading: false,
  error: null,

  fetchReviews: async (buildId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { filters } = get();
      
      // Build the query
      let query = supabase
        .from('build_reviews')
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq('build_id', buildId);
      
      // Apply filters
      if (filters.approvedOnly) {
        query = query.eq('approved', true);
      }
      
      if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
      }
      
      if (filters.categoryFilter && filters.categoryFilter.length > 0) {
        const categoryConditions = filters.categoryFilter.map(category => 
          `category::text[] @> '{${category}}'`
        );
        query = query.or(categoryConditions.join(','));
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'highest_rated':
          query = query.order('rating', { ascending: false });
          break;
        // Most helpful would ideally use a votes system that we'll implement later
        default:
          query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match our BuildReview interface
      const reviews = data.map(review => {
        const profiles = review.profiles as { display_name?: string; avatar_url?: string } | null;
        return {
          ...review,
          reviewer_name: profiles?.display_name,
        };
      }) as BuildReview[];
      
      set({ reviews, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching reviews:', error);
    }
  },
  
  fetchPendingReviews: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('build_reviews')
        .select(`
          *,
          profiles:user_id (display_name, avatar_url),
          builds:build_id (title)
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match our BuildReview interface
      const pendingReviews = data.map(review => {
        const profiles = review.profiles as { display_name?: string; avatar_url?: string } | null;
        const builds = review.builds as { title?: string } | null;
        
        return {
          ...review,
          reviewer_name: profiles?.display_name,
          // Include build title if needed
          build_title: builds?.title,
        };
      }) as BuildReview[];
      
      set({ pendingReviews, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pending reviews';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching pending reviews:', error);
    }
  },
  
  approveReview: async (reviewId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('build_reviews')
        .update({ approved: true })
        .eq('id', reviewId);
      
      if (error) throw error;
      
      toast.success('Review approved successfully');
      
      // Refresh pending reviews
      await get().fetchPendingReviews();
      
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve review';
      set({ error: errorMessage, isLoading: false });
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  },
  
  rejectReview: async (reviewId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('build_reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw error;
      
      toast.success('Review rejected and removed');
      
      // Refresh pending reviews
      await get().fetchPendingReviews();
      
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject review';
      set({ error: errorMessage, isLoading: false });
      console.error('Error rejecting review:', error);
      toast.error('Failed to reject review');
    }
  },
  
  fetchReviewStats: async (buildId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('build_reviews')
        .select('rating, category')
        .eq('build_id', buildId)
        .eq('approved', true);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        set({ 
          stats: {
            averageRating: 0,
            totalReviews: 0,
            categoryBreakdown: {} as Record<ReviewCategory, number>,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          },
          isLoading: false 
        });
        return;
      }
      
      // Calculate average rating
      const ratings = data.map(review => review.rating || 0).filter(rating => rating > 0);
      const sum = ratings.reduce((acc, rating) => acc + rating, 0);
      const averageRating = ratings.length > 0 ? sum / ratings.length : 0;
      
      // Calculate rating distribution
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<ReviewRating, number>;
      ratings.forEach(rating => {
        if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating as ReviewRating] = (ratingDistribution[rating as ReviewRating] || 0) + 1;
        }
      });
      
      // Calculate category breakdown
      const categoryBreakdown = {} as Record<ReviewCategory, number>;
      data.forEach(review => {
        if (review.category && Array.isArray(review.category)) {
          review.category.forEach(category => {
            const categoryKey = category as ReviewCategory;
            categoryBreakdown[categoryKey] = (categoryBreakdown[categoryKey] || 0) + 1;
          });
        }
      });
      
      set({
        stats: {
          averageRating,
          totalReviews: data.length,
          categoryBreakdown,
          ratingDistribution
        },
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch review stats';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching review stats:', error);
    }
  },
  
  updateFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },
  
  setSelectedReview: (review) => {
    set({ selectedReview: review });
  }
}));
