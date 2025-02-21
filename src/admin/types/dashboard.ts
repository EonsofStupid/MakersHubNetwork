
export interface DashboardMetrics {
  activeUsers: number;
  totalUsers: number;
  partsCount: number;
  reviewsCount: number;
}

export interface TrendingPart {
  id: string;
  name: string;
  community_score: number;
  review_count: number;
}

export interface RecentReview {
  id: string;
  title: string;
  rating: number;
  created_at: string;
  printer_parts?: {
    name: string;
  };
}
