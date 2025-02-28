
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { adminKeys } from "@/admin/types/queries"

export const useReviewsCount = () => {
  return useQuery({
    queryKey: [...adminKeys.reviews(), 'count'],
    queryFn: async () => {
      // Fix the table name from 'printer_parts_reviews' to 'part_reviews'
      const { count, error } = await supabase
<<<<<<< HEAD
        .from('part_reviews')
=======
        .from('part_reviews') // Changed from 'printer_parts_reviews' to 'part_reviews'
>>>>>>> parent of 0c79d1a (Reverted to edit edt-cda685f1-217e-496a-a0e4-ff806b9e6b4c: "Fix TypeScript errors in CategoryManagement)
        .select('*', { count: 'exact' })

      if (error) throw error
      return count || 0
    }
  })
}
