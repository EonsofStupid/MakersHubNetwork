
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentFilter, ContentItem } from '@/admin/types/content';

export const useContentItems = (filter: ContentFilter) => {
  return useQuery({
    queryKey: ['content', 'items', filter],
    queryFn: async () => {
      let query = supabase
        .from('content_items')
        .select(`
          *,
          content_type:content_types(*)
        `);

      if (filter.type) {
        query = query.eq('type', filter.type);
      }
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      if (filter.category) {
        query = query.eq('category_id', filter.category);
      }
      if (filter.search) {
        query = query.ilike('title', `%${filter.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Ensure the data matches our ContentItem type
      return (data as any[]).map(item => ({
        ...item,
        metadata: item.metadata || {},
      })) as ContentItem[];
    },
  });
};
