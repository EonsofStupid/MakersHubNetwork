
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '../types/content';

export const useContentTypes = () => {
  return useQuery({
    queryKey: ['contentTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as ContentType[];
    }
  });
};
