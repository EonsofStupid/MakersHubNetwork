
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { adminKeys } from '../types/queries';

export const useTotalUsersCount = () => {
  return useQuery({
    queryKey: adminKeys.totalUsersCount(),
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total users:', error);
        throw error;
      }

      return count || 0;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
