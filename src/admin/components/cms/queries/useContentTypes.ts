
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '../types/content';
import { cmsKeys } from './keys';
import { toast } from '@/hooks/use-toast';
import { slugify } from '@/lib/utils';

export const useContentTypes = () => {
  return useQuery({
    queryKey: cmsKeys.types.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContentType[];
    },
  });
};

interface CreateContentTypeData {
  name: string;
  description?: string;
}

export const useCreateContentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContentTypeData) => {
      const slug = slugify(data.name);
      
      // Check for existing type with same slug
      const { data: existing } = await supabase
        .from('content_types')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        throw new Error('A content type with this name already exists');
      }

      const { data: newType, error } = await supabase
        .from('content_types')
        .insert({
          name: data.name,
          slug,
          description: data.description,
          is_system: false,
        })
        .select()
        .single();

      if (error) throw error;
      return newType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.types.list() });
      toast({
        title: "Content Type Created",
        description: "The content type has been successfully created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
