
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem } from '../types/content';
import { ContentFilter } from '../types/content';
import { adminKeys } from './keys';
import { toast } from '@/hooks/use-toast';

export const useContentItems = ({ filter }: { filter: ContentFilter }) => {
  return useQuery({
    queryKey: adminKeys.content.list(filter),
    queryFn: async () => {
      let query = supabase
        .from('content_items')
        .select(`
          *,
          content_type:type (
            id,
            name,
            slug
          )
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

      const { data, error } = await query;
      if (error) throw error;
      return data as ContentItem[];
    },
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.all() });
      toast({
        title: "Content Deleted",
        description: "The content has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete content: " + error.message,
        variant: "destructive",
      });
    },
  });
};
