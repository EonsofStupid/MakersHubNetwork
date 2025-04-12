
/**
 * Content types for the admin module
 */

export type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export interface ContentFilter {
  status?: ContentStatus;
  type?: string;
  search?: string;
  userId?: string;
  categoryId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  count?: number;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  author_id: string;
  featured_image?: string | null;
  excerpt?: string | null;
  categories?: string[];
  meta?: Record<string, any>;
}

export interface ContentStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  scheduled: number;
}

export interface ContentPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
