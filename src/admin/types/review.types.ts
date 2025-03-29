
import { Build, BuildStatus } from "./build.types";

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type ReviewCategory = 
  | 'Print Quality' 
  | 'Ease of Assembly' 
  | 'Cost Effectiveness' 
  | 'Performance' 
  | 'Customizability' 
  | 'Documentation';

export interface BuildReview {
  id: string;
  build_id: string;
  user_id: string;
  reviewer_name?: string;
  rating: ReviewRating;
  title: string;
  body: string;
  category: ReviewCategory[];
  image_urls: string[];
  created_at: string;
  updated_at?: string;
  approved: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  categoryBreakdown: Record<ReviewCategory, number>;
  ratingDistribution: Record<ReviewRating, number>;
}

export interface ReviewFilters {
  sortBy: 'newest' | 'highest_rated' | 'most_helpful';
  categoryFilter?: ReviewCategory[];
  minRating?: ReviewRating;
  approvedOnly: boolean;
}

export interface ReviewDraft {
  buildId: string;
  rating: ReviewRating;
  title: string;
  body: string;
  categories: ReviewCategory[];
  imageUrls: string[];
}

export interface ReviewAdminState {
  reviews: BuildReview[];
  pendingReviews: BuildReview[];
  selectedReview: BuildReview | null;
  stats: ReviewStats | null;
  filters: ReviewFilters;
  isLoading: boolean;
  error: string | null;
}

export interface ReviewAdminActions {
  fetchReviews: (buildId: string) => Promise<void>;
  fetchPendingReviews: () => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  rejectReview: (reviewId: string) => Promise<void>;
  fetchReviewStats: (buildId: string) => Promise<void>;
  updateFilters: (filters: Partial<ReviewFilters>) => void;
  setSelectedReview: (review: BuildReview | null) => void;
}

export type ReviewAdminStore = ReviewAdminState & ReviewAdminActions;
