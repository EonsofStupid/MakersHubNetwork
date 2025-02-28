
export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';

export interface ContentType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: Record<string, any>;
}

export interface ContentFilter {
  type?: string;
  status?: ContentStatus;
  search?: string;
  category?: string;
} 
