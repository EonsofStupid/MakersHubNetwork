
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { adminKeys } from '../types/queries';

export const usePartsCount = () => {
  return useQuery({
    queryKey: adminKeys.partsCount(),
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from('printer_parts')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
  });
};
