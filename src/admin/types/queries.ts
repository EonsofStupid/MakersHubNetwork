
// Define all admin-related query keys

export type ActiveUsersCount = number;

export type TrendingPart = {
  name: string;
  community_score: number | null;
  review_count: number | null;
};

export type RecentReview = {
  title: string | null;
  rating: number | null;
  created_at: string;
  printer_parts: {
    name: string;
  } | null;
};

export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  activeUsersCount: () => [...adminKeys.users(), 'active', 'count'] as const,
  totalUsersCount: () => [...adminKeys.users(), 'total', 'count'] as const,
  categories: () => [...adminKeys.all, 'categories'] as const,
  parts: () => [...adminKeys.all, 'parts'] as const,
  partsCount: () => [...adminKeys.parts(), 'count'] as const,
  trendingParts: () => [...adminKeys.parts(), 'trending'] as const,
  reviews: () => [...adminKeys.all, 'reviews'] as const,
  reviewsCount: () => [...adminKeys.reviews(), 'count'] as const,
  recentReviews: () => [...adminKeys.reviews(), 'recent'] as const,
  metrics: () => [...adminKeys.all, 'metrics'] as const,
};
