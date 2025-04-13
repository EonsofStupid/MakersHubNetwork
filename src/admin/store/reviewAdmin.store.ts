
import { create } from 'zustand';
import { BuildReview, ReviewStats, ReviewFilters, ReviewAdminState } from '@/shared/types/shared.types';
import { toast } from 'sonner';

interface ReviewAdminStore extends ReviewAdminState {
  // Fetch methods
  fetchReviews: (buildId?: string) => Promise<void>;
  fetchReviewStats: (buildId?: string) => Promise<void>;
  fetchPendingReviews: () => Promise<void>;
  
  // Action methods
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string, reason?: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  
  // Filter methods
  updateFilters: (filters: Partial<ReviewFilters>) => void;
  setFilters: (filters: Partial<ReviewFilters>) => void;
  setPage: (page: number) => void;
}

export const useReviewAdminStore = create<ReviewAdminStore>((set, get) => ({
  // State
  reviews: [],
  pendingReviews: [],
  isLoading: false,
  error: null,
  filters: {
    sortBy: 'newest',
    approvedOnly: false,
    page: 1,
    perPage: 10
  },
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

  // Fetch reviews for a specific build or all reviews
  fetchReviews: async (buildId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call for now
      const response = await fetch(buildId 
        ? `/api/builds/${buildId}/reviews` 
        : `/api/reviews?${new URLSearchParams(get().filters as any)}`);
      
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      set({ reviews: data.reviews, isLoading: false });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch reviews',
        isLoading: false 
      });
    }
  },
  
  // Fetch review statistics
  fetchReviewStats: async (buildId?: string) => {
    try {
      // Mock API call for now
      const response = await fetch(buildId 
        ? `/api/builds/${buildId}/reviews/stats` 
        : `/api/reviews/stats`);
      
      if (!response.ok) throw new Error('Failed to fetch review stats');
      
      const data = await response.json();
      set({ stats: data.stats });
    } catch (error) {
      console.error('Error fetching review stats:', error);
      // Don't set error state to avoid UI disruption
    }
  },
  
  // Fetch pending reviews
  fetchPendingReviews: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call for now
      const response = await fetch('/api/reviews/pending');
      
      if (!response.ok) throw new Error('Failed to fetch pending reviews');
      
      const data = await response.json();
      set({ pendingReviews: data.reviews, isLoading: false });
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch pending reviews',
        isLoading: false 
      });
    }
  },
  
  // Approve a review
  approveReview: async (id: string) => {
    try {
      // Mock API call for now
      const response = await fetch(`/api/reviews/${id}/approve`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to approve review');
      
      // Update local state
      const updatedReviews = get().reviews.map(review => 
        review.id === id ? { ...review, approved: true } : review
      );
      
      // Remove from pending reviews
      const updatedPendingReviews = get().pendingReviews.filter(review => 
        review.id !== id
      );
      
      set({ 
        reviews: updatedReviews,
        pendingReviews: updatedPendingReviews
      });
      
      toast.success('Review approved successfully');
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  },
  
  // Reject a review
  rejectReview: async (id: string, reason?: string) => {
    try {
      // Mock API call for now
      const response = await fetch(`/api/reviews/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      
      if (!response.ok) throw new Error('Failed to reject review');
      
      // Update local state
      const updatedReviews = get().reviews.filter(review => review.id !== id);
      const updatedPendingReviews = get().pendingReviews.filter(review => review.id !== id);
      
      set({ 
        reviews: updatedReviews,
        pendingReviews: updatedPendingReviews
      });
      
      toast.success('Review rejected successfully');
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error('Failed to reject review');
    }
  },
  
  // Delete a review
  deleteReview: async (id: string) => {
    try {
      // Mock API call for now
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete review');
      
      // Update local state
      const updatedReviews = get().reviews.filter(review => review.id !== id);
      const updatedPendingReviews = get().pendingReviews.filter(review => review.id !== id);
      
      set({ 
        reviews: updatedReviews,
        pendingReviews: updatedPendingReviews
      });
      
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  },
  
  // Update filters
  updateFilters: (filters: Partial<ReviewFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
    // Automatically refetch with new filters
    get().fetchReviews();
  },
  
  // Set filters (without refetching)
  setFilters: (filters: Partial<ReviewFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },
  
  // Set page
  setPage: (page: number) => {
    set(state => ({
      filters: { ...state.filters, page }
    }));
    // Automatically refetch with new page
    get().fetchReviews();
  }
}));
