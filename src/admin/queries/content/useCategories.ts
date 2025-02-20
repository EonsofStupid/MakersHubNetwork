
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CategoryTreeItem } from '@/admin/types/content';
import { adminKeys } from './keys';
import { toast } from '@/hooks/use-toast';
import { slugify } from '@/lib/utils';

const buildCategoryTree = (
  categories: CategoryTreeItem[],
  parentId: string | null = null
): CategoryTreeItem[] => {
  return categories
    .filter(category => category.parent_id === parentId)
    .map(category => ({
      ...category,
      children: buildCategoryTree(categories, category.id)
    }));
};

export const useCategories = () => {
  return useQuery({
    queryKey: adminKeys.categories.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return buildCategoryTree(data);
    },
  });
};

interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: string;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      const slug = slugify(data.name);
      
      const { data: newCategory, error } = await supabase
        .from('content_categories')
        .insert({
          name: data.name,
          slug,
          description: data.description,
          parent_id: data.parentId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return newCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.list() });
      toast({
        title: "Category Created",
        description: "The category has been successfully created.",
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

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: CreateCategoryData & { id: string }) => {
      const { error } = await supabase
        .from('content_categories')
        .update({
          name: data.name,
          description: data.description,
          parent_id: data.parentId || null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.list() });
      toast({
        title: "Category Updated",
        description: "The category has been successfully updated.",
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

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.list() });
      toast({
        title: "Category Deleted",
        description: "The category has been successfully deleted.",
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
