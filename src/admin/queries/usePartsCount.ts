
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { adminKeys } from "@/admin/types/queries"

export const usePartsCount = () => {
  return useQuery({
    queryKey: adminKeys.partsCount(),
    queryFn: async () => {
      const { count, error } = await supabase
        .from('printer_parts')
        .select('*', { count: 'exact' })

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    },
  })
}
