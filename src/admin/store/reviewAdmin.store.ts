
import { create } from 'zustand';
import { 
  Review, 
  ReviewStats, 
  BuildReview, 
  ReviewRating,
  ReviewAdminStore
} from '@/shared/types/shared.types';

// Create a store to manage reviews in the admin panel
export const useReviewAdminStore = create<ReviewAdminStore>((set, get) => ({
  // State
  reviews: [],
  selectedReview: null,
  pendingReviews: [],
  stats: null,
  isLoading: false,
  error: null,
  filters: {
    buildId: undefined,
    approved: 'all',
    rating: 'all',
    sort: 'newest',
    approvedOnly: false,
    sortBy: 'newest',
  },
  
  // Fetch reviews, optionally filtered by build ID
  fetchReviews: async (buildId?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // If buildId is provided, fetch reviews for that build
      if (buildId) {
        await get().fetchReviewsByBuildId(buildId);
        return;
      }
      
      // In a real app, this would be an API call with filters
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock data
      const mockReviews: Review[] = [
        {
          id: "review-1",
          build_id: "build-1",
          user_id: "user-1",
          rating: ReviewRating.EXCELLENT,
          content: "Amazing build, really well thought out.",
          created_at: new Date().toISOString(),
          approved: true,
          categories: ["quality", "innovation"]
        },
        {
          id: "review-2",
          build_id: "build-2",
          user_id: "user-2",
          rating: ReviewRating.GOOD,
          content: "Good build, but could use some improvements.",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          approved: false,
          categories: ["quality", "usability"]
        }
      ];
      
      set({ reviews: mockReviews, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : String(error),
        isLoading: false 
      });
    }
  },
  
  // Fetch reviews for a specific build
  fetchReviewsByBuildId: async (buildId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for a specific build
      const mockReviews: Review[] = [
        {
          id: "review-1",
          build_id: buildId,
          user_id: "user-1",
          rating: ReviewRating.EXCELLENT,
          content: "Amazing build, really well thought out.",
          created_at: new Date().toISOString(),
          approved: true,
          categories: ["quality", "innovation"],
          status: "published" as any
        },
        {
          id: "review-2",
          build_id: buildId,
          user_id: "user-2",
          rating: ReviewRating.OK,
          content: "It's okay, but I've seen better.",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          approved: true,
          categories: ["usability"],
          status: "published" as any
        }
      ];
      
      set({ reviews: mockReviews, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : String(error),
        isLoading: false 
      });
    }
  },
  
  // Fetch pending reviews (awaiting approval)
  fetchPendingReviews: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Mock data
      const mockPendingReviews: BuildReview[] = [
        {
          id: "review-3",
          build_id: "build-3",
          user_id: "user-3",
          rating: ReviewRating.GOOD,
          content: "Pretty good overall.",
          title: "Good Quality Build",
          body: "This build has good quality components and is well designed. I particularly like the cooling system.",
          created_at: new Date().toISOString(),
          approved: false,
          categories: ["quality", "cooling"],
          status: "pending" as any,
          reviewer_name: "Janet Builder",
          category: ["quality", "cooling"],
          image_urls: ["https://via.placeholder.com/300x200?text=Review+Image"]
        },
        {
          id: "review-4",
          build_id: "build-4",
          user_id: "user-4",
          rating: ReviewRating.BAD,
          content: "Not impressed with this build.",
          title: "Disappointing Build",
          body: "I had high hopes for this build but the quality doesn't match the description. The parts don't fit well together.",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          approved: false,
          categories: ["quality"],
          status: "pending" as any,
          reviewer_name: "Critical User",
          category: ["quality"],
        }
      ];
      
      set({ 
        pendingReviews: mockPendingReviews, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : String(error),
        isLoading: false 
      });
    }
  },
  
  // Fetch review statistics
  fetchReviewStats: async (buildId?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Mock data
      const mockStats: ReviewStats = {
        totalReviews: 24,
        avgRating: 4.2,
        totalApproved: 20,
        totalPending: 3,
        totalRejected: 1,
        ratingCounts: {
          [ReviewRating.EXCELLENT]: 10,
          [ReviewRating.GOOD]: 8,
          [ReviewRating.OK]: 4,
          [ReviewRating.BAD]: 1,
          [ReviewRating.AWFUL]: 1
        }
      };
      
      set({ stats: mockStats, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : String(error),
        isLoading: false 
      });
    }
  },
  
  // Approve a review
  approveReview: async (reviewId: string, message?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update local state for the review
      set(state => ({
        reviews: state.reviews.map(review => 
          review.id === reviewId 
            ? { ...review, approved: true } 
            : review
        ),
        pendingReviews: state.pendingReviews.filter(review => 
          review.id !== reviewId
        ),
        isLoading: false
      }));
      
      // Refetch pending reviews
      get().fetchPendingReviews();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : String(error),
        isLoading: false 
      });
    }
  },
  
  // Reject a review
  rejectReview: async (reviewId: string, reason: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update local state
      set(state => ({
        pendingReviews: state.pendingReviews.filter(review => 
          review.id !== reviewId
        ),
        isLoading: false
      }));
      
      // Refetch pending reviews
      get().fetchPendingReviews();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : String(error),
        isLoading: false 
      });
    }
  },
  
  // Update filters
  updateFilters: (newFilters: any) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  }
}));
