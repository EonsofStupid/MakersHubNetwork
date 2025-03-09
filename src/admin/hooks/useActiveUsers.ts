
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminKeys } from "@/admin/types/queries";
import { ActiveUser } from "@/admin/types/queries";

export const useActiveUsers = () => {
  return useQuery({
    queryKey: adminKeys.activeUsers(),
    queryFn: async (): Promise<ActiveUser[]> => {
      console.log("Fetching active users data...");
      
      // Get active users from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, last_login, is_active')
        .eq('is_active', true)
        .order('last_login', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching active users:", error);
        throw error;
      }

      // Transform the data to match the ActiveUser interface
      return data.map((user) => ({
        id: user.id,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        last_seen: user.last_login,
        status: user.is_active ? 'Active' : 'Inactive'
      }));
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 3, // Retry failed requests 3 times
  });
};
