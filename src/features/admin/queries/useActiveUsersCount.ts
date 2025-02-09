
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { adminKeys } from '../types/queries';

interface UserCounts {
  count: number;
  total_count: number;
}

export const useActiveUsersCount = () => {
  return useQuery({
    queryKey: adminKeys.activeUsersCount(),
    queryFn: async (): Promise<UserCounts> => {
      console.log('Fetching active users count...');
      
      // Get counts with a single query using count aggregation
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .or('is_active.eq.true,admin_override_active.eq.true');

      if (error) {
        console.error('Error fetching active users:', error);
        throw error;
      }

      // Get total count with a separate count query
      const { count: totalCount, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        console.error('Error fetching total count:', totalError);
        throw totalError;
      }

      const counts = {
        count: count || 0,
        total_count: totalCount || 0
      };

      console.log('Active users count data:', counts);
      return counts;
    },
    refetchInterval: 3600000, // Refresh every hour
  });
};
