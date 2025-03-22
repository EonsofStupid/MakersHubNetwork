
export type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  type: 'post' | 'page' | 'product' | 'model' | 'other';
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  categories?: string[];
  metadata?: Record<string, any>;
}

export interface ContentFilter {
  status?: ContentStatus | 'all';
  type?: string;
  search?: string;
  tags?: string[];
  categories?: string[];
  authorId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface ContentStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  scheduled: number;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  count: number;
}

export interface ContentTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}
