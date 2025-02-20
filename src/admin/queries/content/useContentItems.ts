
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem, ContentFilter } from '@/admin/types/content';
import { adminKeys } from './keys';

export const useContentItems = (filter: ContentFilter) => {
  return useQuery({
    queryKey: adminKeys.content.list(filter),
    queryFn: async () => {
      let query = supabase
        .from('content_items')
        .select(`
          *,
          content_type:type (*)
        `);

      if (filter.type) {
        query = query.eq('type', filter.type);
      }
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      if (filter.search) {
        query = query.ilike('title', `%${filter.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContentItem[];
    },
  });
};
