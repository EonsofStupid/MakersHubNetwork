
// Content management types
import { ContentStatus } from '@/shared/types/shared.types';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: ContentStatus;
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta?: ContentMeta;
}

export interface ContentMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  og_image?: string;
}

export interface ContentFilter {
  status?: ContentStatus;
  type?: string;
  search?: string;
  authorId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ContentPagination {
  page: number;
  perPage: number;
  total: number;
}

export interface ContentSortOption {
  field: 'title' | 'created_at' | 'updated_at' | 'published_at';
  direction: 'asc' | 'desc';
}

export interface ContentTypeDefinition {
  id: string;
  name: string;
  description?: string;
  fields: ContentField[];
  defaultStatus: ContentStatus;
}

export type ContentFieldType = 
  | 'text' 
  | 'textarea' 
  | 'richtext' 
  | 'number' 
  | 'boolean'
  | 'date'
  | 'image'
  | 'gallery'
  | 'select'
  | 'multiselect'
  | 'reference';

export interface ContentField {
  id: string;
  name: string;
  type: ContentFieldType;
  required: boolean;
  default?: any;
  options?: string[]; // For select/multiselect fields
  reference?: string; // For reference fields (references another content type)
}
