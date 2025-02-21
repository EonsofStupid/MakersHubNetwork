
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrendingPart } from '@/admin/types/dashboard';

export const useTrendingParts = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'trendingParts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('printer_parts')
        .select('id, name, community_score, review_count')
        .order('community_score', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as TrendingPart[];
    },
  });
};
