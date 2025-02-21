
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useActiveUsersCount = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'activeUsers'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .gt('last_seen', new Date(Date.now() - 15 * 60 * 1000).toISOString());

      if (error) throw error;
      return count || 0;
    },
  });
};
