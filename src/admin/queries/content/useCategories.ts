
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CategoryTreeItem } from '@/admin/types/content';
import { slugify } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

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
    queryKey: ['admin', 'categories'],
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};
