
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTotalUsersCount = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'totalUsers'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
  });
};
