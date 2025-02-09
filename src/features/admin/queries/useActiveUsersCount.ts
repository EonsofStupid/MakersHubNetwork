
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
      
      // Get active users count
      const { data: activeData, error: activeError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .or('is_active.eq.true,admin_override_active.eq.true');

      if (activeError) {
        console.error('Error fetching active users:', activeError);
        throw activeError;
      }

      // Get total users count
      const { data: totalData, error: totalError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (totalError) {
        console.error('Error fetching total users:', totalError);
        throw totalError;
      }

      console.log('Active users count:', activeData?.count);
      console.log('Total users count:', totalData?.count);

      return {
        count: activeData?.count || 0,
        total_count: totalData?.count || 0
      };
    },
    // Set stale time to 5 minutes (matches the global config)
    staleTime: 5 * 60 * 1000,
  });
};
