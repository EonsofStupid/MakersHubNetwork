import type { Tables } from './utils';

export type PaginationParams = {
  page?: number;
  per_page?: number;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
};

export type PaginatedResult<T> = {
  data: T[];
  metadata: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
  };
};

// Example usage
export type BlogPostsPaginated = PaginatedResult<Tables<"blog_posts">>;