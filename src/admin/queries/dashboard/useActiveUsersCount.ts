
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useActiveUsersCount = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'activeUsers'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (error) throw error;
      return count || 0;
    },
  });
};
