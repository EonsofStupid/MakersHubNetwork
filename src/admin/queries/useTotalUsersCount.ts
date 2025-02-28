import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { adminKeys } from "@/admin/types/queries"

export const useTotalUsersCount = () => {
  return useQuery({
    queryKey: adminKeys.totalUsersCount(),
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      return count || 0;
    },
  })
}
