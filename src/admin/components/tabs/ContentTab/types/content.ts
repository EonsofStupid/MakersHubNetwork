
import { Database } from "@/integrations/supabase/types";

export type ContentType = Database["public"]["Tables"]["content_types"]["Row"];
export type ContentStatus = Database["public"]["Enums"]["content_status"];
export type ContentItem = Database["public"]["Tables"]["content_items"]["Row"];

export interface ContentFilter {
  type?: string;
  status?: ContentStatus;
  category?: string;
  search?: string;
}
