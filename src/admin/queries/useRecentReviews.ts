
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { adminKeys } from "@/admin/types/queries"
import type { RecentReview } from "@/admin/types/queries"

export const useRecentReviews = () => {
  return useQuery({
    queryKey: adminKeys.recentReviews(),
    queryFn: async () => {
      // Fix the table name from 'reviews' to 'part_reviews'
      const { data, error } = await supabase
        .from('part_reviews')
        .select(`
          title,
          rating,
          created_at,
          printer_parts:part_id (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      return (data || []) as RecentReview[]
    },
  })
}
