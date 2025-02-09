
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { adminKeys } from '../types/queries';
import type { ActiveUsersCount } from '../types/queries';

export const useActiveUsersCount = () => {
  return useQuery({
    queryKey: adminKeys.activeUsersCount(),
    queryFn: async (): Promise<ActiveUsersCount> => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
  });
};
