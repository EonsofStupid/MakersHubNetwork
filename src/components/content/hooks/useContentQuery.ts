import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BaseContent } from "../types/cms";

export const useContentQuery = (contentId?: string) => {
  return useQuery({
    queryKey: ["cms_content", contentId],
    queryFn: async () => {
      console.log("Fetching content:", contentId);
      if (!contentId) return null;

      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .eq("id", contentId)
        .single();

      if (error) {
        console.error("Error fetching content:", error);
        toast.error("Failed to load content");
        throw error;
      }

      console.log("Fetched content:", data);
      return data as BaseContent;
    },
    enabled: !!contentId,
  });
};