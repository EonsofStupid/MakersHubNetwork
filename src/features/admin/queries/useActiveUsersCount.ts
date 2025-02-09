
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
      const { data, error } = await supabase
        .from('active_users_count')
        .select('count, total_count')
        .single();
      
      if (error) {
        console.error('Error fetching active users count:', error);
        throw error;
      }
      
      console.log('Active users count data:', data);
      return {
        count: data?.count || 0,
        total_count: data?.total_count || 0
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
