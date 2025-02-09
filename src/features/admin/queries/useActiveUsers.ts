
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '../types/queries';
import { adminKeys } from '../types/queries';

export const useActiveUsers = () => {
  return useQuery({
    queryKey: adminKeys.activeUsers(),
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          avatar_url,
          is_active,
          user_roles (
            id,
            role
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });
};
