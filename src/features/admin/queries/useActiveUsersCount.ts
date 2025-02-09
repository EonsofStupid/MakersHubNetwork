
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
      
      // Get active users from profiles table
      const { data: activeUsers, error: activeError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_active', true);

      if (activeError) {
        console.error('Error fetching active users:', activeError);
        throw activeError;
      }

      // Get total users count
      const { data: totalUsers, error: totalError } = await supabase
        .from('profiles')
        .select('id');

      if (totalError) {
        console.error('Error fetching total users:', totalError);
        throw totalError;
      }

      const counts = {
        count: activeUsers?.length || 0,
        total_count: totalUsers?.length || 0
      };

      console.log('Active users count data:', counts);
      return counts;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
