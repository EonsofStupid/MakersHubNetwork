import { Database } from './database';
import type { Profile } from './auth';
import type { Json } from './database';

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type CMSContent = Database['public']['Tables']['cms_content']['Row'];
export type CMSComponent = Database['public']['Tables']['cms_components']['Row'];
export type CMSCategory = Database['public']['Tables']['cms_categories']['Row'];

export type ContentStatus = Database['public']['Enums']['content_status'];
export type ContentType = Database['public']['Enums']['content_type'];
export type PostCategory = Database['public']['Enums']['post_category'];

export interface ContentRelationship {
  id: string;
  parentId: string;
  childId: string;
  relationshipType: string;
  orderIndex?: number;
}

export interface ContentRevision {
  id: string;
  content_id: string;
  content: Json;
  metadata?: Json;
  created_by?: string;
  created_at: string;
  version_number: number;
  change_summary?: string;
  publish_status?: string;
  scheduled_publish_at?: string;
  rollback_from?: string;
  rollback_metadata?: Json;
  profiles?: {
    display_name: string;
  };
}