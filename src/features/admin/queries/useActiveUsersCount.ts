
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { adminKeys } from '../types/queries';

export const useActiveUsersCount = () => {
  return useQuery({
    queryKey: adminKeys.activeUsersCount(),
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase
        .from('active_users_count')
        .select('count')
        .single();
      
      if (error) throw error;
      return data?.count || 0;
    },
    refetchInterval: 30000,
  });
};
