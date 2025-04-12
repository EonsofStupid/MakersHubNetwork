
export type ReviewCategory = 'Print Quality' | 'Ease of Assembly' | 'Cost Effectiveness' | 'Performance' | 'Customizability' | 'Documentation';

export interface Review {
  id: string;
  user_id: string;
  build_id?: string;
  product_id?: string;
  rating: number;
  content: string;
  categories: ReviewCategory[];
  status: ReviewStatus;
  image_urls?: string[];
  created_at: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewStats {
  totalReviews: number;
  avgRating: number;
  categoryBreakdown: Record<ReviewCategory, number>;
  ratingDistribution: Record<number, number>;
}

export interface ReviewRating {
  rating: number;
  count: number;
  percentage: number;
}

export interface ReviewDraft {
  build_id?: string;
  product_id?: string;
  rating: number;
  content: string;
  categories: ReviewCategory[];
  image_urls?: string[];
}

export interface BuildReview extends Review {
  build_title?: string;
  build_image?: string;
}

export interface ReviewAdminStore {
  reviews: Review[];
  selectedReview: Review | null;
  isLoading: boolean;
  error: string | null;
  stats: ReviewStats;
  
  fetchReviews: () => Promise<void>;
  fetchReviewById: (id: string) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string, reason: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}
