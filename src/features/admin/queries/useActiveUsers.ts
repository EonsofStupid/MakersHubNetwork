
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

export type ActiveUser = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  user_roles: Array<{
    id: string;
    role: Database['public']['Enums']['user_role'];
  }>;
};

export const useActiveUsers = () => {
  return useQuery({
    queryKey: ['admin', 'activeUsers'],
    queryFn: async () => {
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

      if (error) {
        console.error('Error fetching active users:', error);
        throw error;
      }

      return data as unknown as ActiveUser[];
    },
    refetchInterval: 30000
  });
};
