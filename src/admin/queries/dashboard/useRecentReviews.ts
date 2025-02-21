
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RecentReview } from '@/admin/types/dashboard';

export const useRecentReviews = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'recentReviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('part_reviews')
        .select(`
          id,
          title,
          rating,
          created_at,
          printer_parts (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as RecentReview[];
    },
  });
};
