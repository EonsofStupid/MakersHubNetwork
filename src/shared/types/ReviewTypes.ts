
import { BaseEntity } from "./shared.types";

export type ReviewRating = number;

export interface Review {
  id: string;
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
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    displayName?: string;
    email?: string;
  };
}

export interface ReviewDraft {
  build_id?: string;
  product_id?: string;
  rating: ReviewRating;
  content: string;
  categories: string[];
  image_urls?: string[];
}

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

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  avgRating?: number;
  ratingCounts: Record<number, number>;
  recentReviews: Review[];
}

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
