export interface ContentType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentFilter {
  type?: string;
  status?: ContentStatus;
  category?: string;
  search?: string;
  filter?: string;
}

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryTreeItem extends Omit<Category, 'description'> {
  description?: string;
  children?: CategoryTreeItem[];
}

export interface ContentItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  content: string;
  status: ContentStatus;
  category_id?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}
