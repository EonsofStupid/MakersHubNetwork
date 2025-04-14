
/**
 * Review system types
 */
import { BaseEntity } from '../core/common.types';

// Review rating type
export type ReviewRating = number;

// Review interface
export interface Review extends BaseEntity {
  user_id: string;
  build_id?: string;
  product_id?: string;
  rating: ReviewRating;
  title?: string;
  content?: string;
  body?: string;
  approved?: boolean;
  categories?: string[];
  category?: string[];
  is_verified_purchase?: boolean;
  image_urls?: string[];
  user?: {
    id: string;
    displayName?: string;
    email?: string;
  };
}

// Review draft
export interface ReviewDraft {
  build_id?: string;
  product_id?: string;
  rating: ReviewRating;
  content: string;
  categories: string[];
  image_urls?: string[];
}

// Review filters
export interface ReviewFilters {
  buildId?: string; 
  productId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
  categories?: string[];
  searchText?: string;
  approvedOnly?: boolean;
  sortBy?: 'latest' | 'rating' | 'helpful';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Review stats
export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  avgRating?: number;
  ratingCounts: Record<number, number>;
  recentReviews: Review[];
}

// Review admin state
export interface ReviewAdminState {
  reviews: Review[];
  pendingReviews?: Review[];
  totalPages: number;
  currentPage: number;
  filters: ReviewFilters;
  loading: boolean;
  error: string | null;
  stats?: ReviewStats;
}
