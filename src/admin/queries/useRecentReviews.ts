
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { adminKeys } from "@/admin/types/queries"

export interface RecentReview {
  title: string;
  rating: number;
  created_at: string;
  printer_parts: {
    name: string;
  };
  part_id?: string;
}

export const useRecentReviews = () => {
  return useQuery({
    queryKey: [...adminKeys.all, 'reviews', 'recent'],
    queryFn: async () => {
      // Fix the table name from 'reviews' to 'part_reviews'
      const { data, error } = await supabase
        .from('part_reviews')
        .select(`
          title,
          rating,
          created_at,
          part_id,
          printer_parts:part_id (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message)
      }

      return (data || []) as RecentReview[]
    },
  })
}
