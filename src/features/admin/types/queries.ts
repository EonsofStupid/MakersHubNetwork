
import type { Database } from "@/integrations/supabase/types";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  user_roles: Array<{
    id: string;
    role: Database["public"]["Enums"]["user_role"];
  }>;
};

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
  activeUsers: () => [...adminKeys.users(), 'active'] as const,
  parts: () => [...adminKeys.all, 'parts'] as const,
  partsCount: () => [...adminKeys.parts(), 'count'] as const,
  trendingParts: () => [...adminKeys.parts(), 'trending'] as const,
  reviews: () => [...adminKeys.all, 'reviews'] as const,
  reviewsCount: () => [...adminKeys.reviews(), 'count'] as const,
  recentReviews: () => [...adminKeys.reviews(), 'recent'] as const,
};
