
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useActiveUsers(limit = 5) {
  return useQuery({
    queryKey: ['admin', 'activeUsers', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, last_seen, status')
        .eq('is_active', true)
        .order('last_seen', { ascending: false })
        .limit(limit);
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    },
    refetchInterval: 60000, // Refetch every minute
  });
}
