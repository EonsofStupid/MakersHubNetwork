
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { RecentReview } from '../types/queries';
import { adminKeys } from '../types/queries';

export const useRecentReviews = () => {
  return useQuery({
    queryKey: adminKeys.recentReviews(),
    queryFn: async (): Promise<RecentReview[]> => {
      const { data, error } = await supabase
        .from('part_reviews')
        .select(`
          title,
          rating,
          created_at,
          printer_parts(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });
};
