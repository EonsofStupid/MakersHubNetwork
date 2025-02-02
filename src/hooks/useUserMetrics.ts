import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserMetrics = () => {
  return useQuery({
    queryKey: ['user-metrics'],
    queryFn: async () => {
      console.log('Fetching user metrics...');
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', sevenDaysAgo.toISOString());

      console.log('Metrics fetched:', { totalUsers, newUsers, activeUsers });
      
      return {
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        activeUsers: activeUsers || 0
      };
    },
  });
};