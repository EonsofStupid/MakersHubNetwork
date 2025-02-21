
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
}

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id: string | null;
  created_at: string;
  children?: CategoryTreeItem[];
}
