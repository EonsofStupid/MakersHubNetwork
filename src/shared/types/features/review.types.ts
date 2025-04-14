
/**
 * Review system types
 */
import { BaseEntity } from '../core/common.types';

export interface ReviewBase extends BaseEntity {
  user_id: string;
  rating: number;
  title?: string;
  content?: string;
  approved?: boolean;
}

export interface BuildReview extends ReviewBase {
  build_id: string;
  category?: string[];
  image_urls?: string[];
  body?: string;
}

export interface PartReview extends ReviewBase {
  part_id: string;
  verified_purchase?: boolean;
  helpful_votes?: number;
  pros?: string[];
  cons?: string[];
}

export interface ReviewStats {
  averageRating: number;
  reviewCount: number;
  reviewDistribution: Record<number, number>;
}

export interface ReviewFilter {
  minRating?: number;
  maxRating?: number;
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'most_helpful';
  verified?: boolean;
}
