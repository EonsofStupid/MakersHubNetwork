import { Json } from "@/integrations/supabase/types";
import type { BaseContent } from "@/components/content/types/cms";

export const isContentPage = (content: Json): boolean => {
  return typeof content === 'object' && content !== null && 'type' in content && content.type === 'page';
};

export const isContentComponent = (content: Json): boolean => {
  return typeof content === 'object' && content !== null && 'type' in content && content.type === 'component';
};