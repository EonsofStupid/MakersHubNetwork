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

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  children?: CategoryTreeItem[];
}

export interface ContentItem {
  id: string;
  type: string;
  title: string;
  content: string;
  status: ContentStatus;
  category_id?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  version: number;
  metadata: Record<string, any>;
  content_type?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_system: boolean;
    created_at: string;
    updated_at: string;
  };
}
