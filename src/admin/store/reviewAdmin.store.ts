
import { create } from 'zustand';
import { 
  Review, 
  ReviewAdminStore, 
  ReviewRating, 
  ReviewStats 
} from '@/shared/types/shared.types';

export const useReviewAdminStore = create<ReviewAdminStore>((set, get) => ({
  reviews: [],
  selectedReview: null,
  isLoading: false,
  error: null,
  stats: {
    totalReviews: 0,
    avgRating: 0,
    ratingCounts: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  },

  fetchReviews: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // This is mock data for demonstration purposes
      const mockReviews: Review[] = [
        {
          id: '1',
          user_id: 'user-1',
          build_id: 'build-1',
          rating: 5,
          content: 'Amazing build, very easy to put together and works perfectly!',
          categories: ['Print Quality', 'Ease of Assembly'],
          status: 'approved',
          created_at: new Date().toISOString(),
          image_urls: [
            'https://placehold.co/400x300?text=Print+1',
            'https://placehold.co/400x300?text=Print+2'
          ]
        },
        {
          id: '2',
          user_id: 'user-2',
          build_id: 'build-2',
          rating: 4,
          content: 'Good build overall, but some parts were difficult to assemble.',
          categories: ['Performance', 'Documentation'],
          status: 'approved',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          image_urls: [
            'https://placehold.co/400x300?text=Review+Image'
          ]
        },
        {
          id: '3',
          user_id: 'user-3',
          build_id: 'build-3',
          rating: 3,
          content: 'Average build. Works as expected but nothing special.',
          categories: ['Performance'],
          status: 'pending',
          created_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '4',
          user_id: 'user-4',
          build_id: 'build-1',
          rating: 2,
          content: 'Had several issues with this build. Parts didn\'t fit well together.',
          categories: ['Ease of Assembly', 'Print Quality'],
          status: 'pending',
          created_at: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: '5',
          user_id: 'user-5',
          build_id: 'build-4',
          rating: 1,
          content: 'Did not work at all. Complete waste of time and filament.',
          categories: ['Performance', 'Documentation'],
          status: 'rejected',
          created_at: new Date(Date.now() - 345600000).toISOString()
        }
      ];
      
      set({ reviews: mockReviews, isLoading: false });
      
      // Calculate stats
      get().calculateStats();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch reviews', 
        isLoading: false 
      });
    }
  },
  
  fetchReviewById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // This is mock data for demonstration purposes
      const mockReview: Review = {
        id,
        user_id: 'user-123',
        build_id: 'build-456',
        rating: 5,
        content: 'Detailed review content here...',
        categories: ['Print Quality', 'Performance'],
        status: 'pending',
        created_at: new Date().toISOString(),
        image_urls: [
          'https://placehold.co/400x300?text=Review+Image+1',
          'https://placehold.co/400x300?text=Review+Image+2'
        ]
      };
      
      set({ selectedReview: mockReview, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch review', 
        isLoading: false 
      });
    }
  },
  
  approveReview: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For now, just update the local state
      
      const reviews = get().reviews.map(review => 
        review.id === id ? { ...review, status: 'approved' as const } : review
      );
      
      set({ reviews, isLoading: false });
      
      // If the current selected review is the one being approved, update it too
      if (get().selectedReview?.id === id) {
        set({ selectedReview: { ...get().selectedReview!, status: 'approved' as const } });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to approve review', 
        isLoading: false 
      });
    }
  },
  
  rejectReview: async (id: string, reason: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For now, just update the local state
      
      const reviews = get().reviews.map(review => 
        review.id === id ? { ...review, status: 'rejected' as const } : review
      );
      
      set({ reviews, isLoading: false });
      
      // If the current selected review is the one being rejected, update it too
      if (get().selectedReview?.id === id) {
        set({ selectedReview: { ...get().selectedReview!, status: 'rejected' as const } });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reject review', 
        isLoading: false 
      });
    }
  },
  
  deleteReview: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For now, just update the local state
      
      const reviews = get().reviews.filter(review => review.id !== id);
      
      set({ 
        reviews, 
        isLoading: false,
        // If the current selected review is the one being deleted, clear it
        selectedReview: get().selectedReview?.id === id ? null : get().selectedReview
      });
      
      // Recalculate stats
      get().calculateStats();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete review', 
        isLoading: false 
      });
    }
  },
  
  calculateStats: () => {
    const { reviews } = get();
    
    if (!reviews.length) {
      set({
        stats: {
          totalReviews: 0,
          avgRating: 0,
          ratingCounts: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          }
        }
      });
      return;
    }
    
    const totalReviews = reviews.length;
    const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = ratingSum / totalReviews;
    
    // Count ratings
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    
    reviews.forEach(review => {
      const rating = review.rating as 1 | 2 | 3 | 4 | 5;
      ratingCounts[rating] += 1;
    });
    
    set({
      stats: {
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        ratingCounts
      }
    });
  }
}));
