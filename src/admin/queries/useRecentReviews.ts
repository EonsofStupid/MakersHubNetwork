
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { adminKeys } from "@/admin/types/queries"
import type { RecentReview } from "@/admin/types/queries"

export interface RecentReview {
  title: string;
  rating: number;
  created_at: string;
  printer_parts: {
    name: string;
  };
}

export const useRecentReviews = () => {
  return useQuery({
    queryKey: adminKeys.recentReviews(),
    queryFn: async () => {
      // Fix the table name from 'reviews' to 'part_reviews'
      const { data, error } = await supabase
<<<<<<< HEAD
        .from('part_reviews')
=======
        .from('part_reviews') // Changed from 'reviews' to 'part_reviews' based on the error
>>>>>>> parent of 0c79d1a (Reverted to edit edt-cda685f1-217e-496a-a0e4-ff806b9e6b4c: "Fix TypeScript errors in CategoryManagement)
        .select(`
          title,
          rating,
          created_at,
<<<<<<< HEAD
=======
          part_id,
>>>>>>> parent of 0c79d1a (Reverted to edit edt-cda685f1-217e-496a-a0e4-ff806b9e6b4c: "Fix TypeScript errors in CategoryManagement)
          printer_parts:part_id (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

<<<<<<< HEAD
      if (error) throw error
=======
      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message)
      }

>>>>>>> parent of 0c79d1a (Reverted to edit edt-cda685f1-217e-496a-a0e4-ff806b9e6b4c: "Fix TypeScript errors in CategoryManagement)
      return (data || []) as RecentReview[]
    },
  })
}
