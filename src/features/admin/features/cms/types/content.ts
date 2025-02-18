
import { Database } from "@/integrations/supabase/types";

export type ContentType = Database["public"]["Tables"]["content_types"]["Row"];
export type ContentStatus = Database["public"]["Enums"]["content_status"];

export type ContentItem = Database["public"]["Tables"]["content_items"]["Row"] & {
  content_type?: ContentType;
};

export type ContentCategory = Database["public"]["Tables"]["content_categories"]["Row"];
export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"];

export interface ContentFilter {
  type?: string;
  status?: ContentStatus;
  category?: string;
  search?: string;
}

export interface CategoryTreeItem extends ContentCategory {
  children?: CategoryTreeItem[];
}
