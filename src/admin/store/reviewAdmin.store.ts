import { createStore } from 'zustand/vanilla';
import { Review, ReviewStats } from '@/shared/types/shared.types';

export interface ReviewFilters {
  status?: string;
  rating?: number;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  sortBy?: string;
  search?: string;
}

export interface ReviewAdminStore {
  reviews: Review[];
  pendingReviews: Review[];
  selectedReview: Review | null;
  filters: ReviewFilters;
  loading: boolean;
  error: string | null;
  stats: ReviewStats;
  
  fetchReviews: () => Promise<void>;
  fetchReviewById: (id: string) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string, reason: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  fetchPendingReviews: () => Promise<void>;
  fetchReviewStats: () => Promise<void>;
  updateFilters: (filters: Partial<ReviewFilters>) => void;
  calculateStats: () => void;
}

const defaultStats: ReviewStats = {
  totalReviews: 0,
  avgRating: 0,
  ratingCounts: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }
};

const reviewAdminStore = createStore<ReviewAdminStore>()((set, get) => ({
  reviews: [],
  pendingReviews: [],
  selectedReview: null,
  filters: {
    status: 'all',
    rating: 0,
    dateRange: {
      from: null,
      to: null
    },
    sortBy: 'newest',
    search: ''
  },
  loading: false,
  error: null,
  stats: defaultStats,
  
  fetchReviews: async () => {
    try {
      set({ loading: true, error: null });
      // Implement actual fetch logic here
      // const reviews = await fetchReviewsFromApi();
      // set({ reviews });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch reviews' });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchReviewById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      // Implement actual fetch logic here
      // const review = await fetchReviewByIdFromApi(id);
      // set({ selectedReview: review });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch review' });
    } finally {
      set({ loading: false });
    }
  },
  
  approveReview: async (id: string) => {
    try {
      set({ loading: true, error: null });
      // Implement actual approve logic here
      // await approveReviewApi(id);
      // Update the reviews list after approval
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to approve review' });
    } finally {
      set({ loading: false });
    }
  },
  
  rejectReview: async (id: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      // Implement actual reject logic here
      // await rejectReviewApi(id, reason);
      // Update the reviews list after rejection
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to reject review' });
    } finally {
      set({ loading: false });
    }
  },
  
  deleteReview: async (id: string) => {
    try {
      set({ loading: true, error: null });
      // Implement actual delete logic here
      // await deleteReviewApi(id);
      // Update the reviews list after deletion
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete review' });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchPendingReviews: async () => {
    try {
      set({ loading: true, error: null });
      // Implement actual fetch logic here
      // const pendingReviews = await fetchPendingReviewsFromApi();
      // set({ pendingReviews });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch pending reviews' });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchReviewStats: async () => {
    try {
      set({ loading: true, error: null });
      // Implement actual fetch logic here
      // const stats = await fetchReviewStatsFromApi();
      // set({ stats });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch review stats' });
    } finally {
      set({ loading: false });
    }
  },
  
  updateFilters: (filters: Partial<ReviewFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
  
  calculateStats: () => {
    const { reviews } = get();
    
    if (reviews.length === 0) {
      set({ stats: defaultStats });
      return;
    }
    
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    
    let totalRating = 0;
    
    reviews.forEach(review => {
      const rating = review.rating || 0;
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating as 1|2|3|4|5]++;
        totalRating += rating;
      }
    });
    
    const avgRating = totalRating / reviews.length;
    
    set({
      stats: {
        totalReviews: reviews.length,
        avgRating,
        ratingCounts
      }
    });
  }
}));

export const useReviewAdminStore = reviewAdminStore;
