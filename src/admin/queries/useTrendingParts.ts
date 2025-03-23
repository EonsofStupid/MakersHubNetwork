
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TrendingPart } from "@/admin/types/queries"
import { adminKeys } from "@/admin/types/queries"

export const useTrendingParts = () => {
  return useQuery({
    queryKey: adminKeys.trendingParts(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('printer_parts')
        .select('name, community_score, review_count')
        .order('community_score', { ascending: false })
        .limit(5)

      if (error) {
        console.error("Error fetching trending parts:", error);
        throw error;
      }

      return data as TrendingPart[];
    },
  })
}
