
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TrendingPart } from '../types/queries';
import { adminKeys } from '../types/queries';

export const useTrendingParts = () => {
  return useQuery({
    queryKey: adminKeys.trendingParts(),
    queryFn: async (): Promise<TrendingPart[]> => {
      const { data, error } = await supabase
        .from('printer_parts')
        .select('name, community_score, review_count')
        .order('community_score', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });
};
