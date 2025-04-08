
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
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

      // Properly map the response to match the expected type
      return (data || []).map(item => ({
        title: item.title,
        rating: item.rating,
        created_at: item.created_at,
        part_id: item.part_id,
        printer_parts: {
          name: item.printer_parts?.name || 'Unknown'
        }
      })) as RecentReview[]
    },
  })
}
