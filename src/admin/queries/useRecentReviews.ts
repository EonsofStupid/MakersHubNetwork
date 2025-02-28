import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { RecentReview } from "@/admin/types/queries"
import { adminKeys } from "@/admin/types/queries"

export const useRecentReviews = () => {
  return useQuery({
    queryKey: adminKeys.recentReviews(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          title,
          rating,
          created_at,
          printer_parts (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message)
      }

      return data as RecentReview[]
    },
  })
}
