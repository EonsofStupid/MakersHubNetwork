
import { create } from 'zustand';

interface Review {
  id: string;
  title: string;
  body: string;
  rating: number;
  user_id: string;
  build_id?: string;
  part_id?: string;
  approved: boolean;
  created_at: string;
}

interface ReviewFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  type: 'all' | 'build' | 'part';
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ReviewAdminState {
  reviews: Review[];
  selectedReview: Review | null;
  isLoading: boolean;
  error: string | null;
  filters: ReviewFilters;
  totalCount: number;
  page: number;
  pageSize: number;
}

export const useReviewAdminStore = create<ReviewAdminState & {
  fetchReviews: () => Promise<void>;
  fetchPendingReviews: () => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string, reason?: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ReviewFilters>) => void;
  setPage: (page: number) => void;
}>((set) => ({
  reviews: [],
  selectedReview: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    type: 'all',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  },
  totalCount: 0,
  page: 1,
  pageSize: 10,

  fetchReviews: async () => {
    set({ isLoading: true });
    try {
      // Mock data
      const mockReviews: Review[] = [
        {
          id: '1',
          title: 'Great build',
          body: 'This was a really helpful build guide',
          rating: 5,
          user_id: 'user1',
          build_id: 'build1',
          approved: false,
          created_at: new Date().toISOString()
        },
        // More mock data would go here
      ];
      set({ 
        reviews: mockReviews, 
        isLoading: false,
        totalCount: mockReviews.length
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch reviews',
        isLoading: false
      });
    }
  },

  fetchPendingReviews: async () => {
    set({ isLoading: true });
    try {
      // Mock data
      const pendingReviews: Review[] = [
        {
          id: '1',
          title: 'Pending Review',
          body: 'This review is awaiting approval',
          rating: 4,
          user_id: 'user1',
          build_id: 'build1',
          approved: false,
          created_at: new Date().toISOString()
        },
        // More mock data would go here
      ];
      set({ 
        reviews: pendingReviews, 
        isLoading: false,
        totalCount: pendingReviews.length
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch pending reviews',
        isLoading: false
      });
    }
  },

  approveReview: async (id: string) => {
    set({ isLoading: true });
    try {
      // Mock approval logic
      set(state => ({
        reviews: state.reviews.map(review =>
          review.id === id ? { ...review, approved: true } : review
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to approve review',
        isLoading: false
      });
    }
  },

  rejectReview: async (id: string, reason?: string) => {
    set({ isLoading: true });
    try {
      // Mock rejection logic
      set(state => ({
        reviews: state.reviews.filter(review => review.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reject review',
        isLoading: false
      });
    }
  },

  deleteReview: async (id: string) => {
    set({ isLoading: true });
    try {
      // Mock deletion logic
      set(state => ({
        reviews: state.reviews.filter(review => review.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete review',
        isLoading: false
      });
    }
  },

  setFilters: (filters: Partial<ReviewFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      page: 1 // Reset to first page on filter change
    }));
  },

  setPage: (page: number) => {
    set({ page });
  }
}));
