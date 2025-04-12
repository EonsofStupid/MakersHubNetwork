
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/auth/lib/supabase';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { ContentCategory } from '@/admin/types/content';

/**
 * Hook for fetching categories
 */
export function useCategories() {
  const logger = useLogger('useCategories', LogCategory.CONTENT);

  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<ContentCategory[]> => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        return data as ContentCategory[];
      } catch (err) {
        logger.error('Failed to fetch categories', {
          details: { error: String(err) }
        });
        throw err;
      }
    }
  });
}

/**
 * Hook for creating a category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const logger = useLogger('useCreateCategory', LogCategory.CONTENT);

  return useMutation({
    mutationFn: async (category: Omit<ContentCategory, 'id'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as ContentCategory;
    },
    onSuccess: (data) => {
      logger.info(`Category created: ${data.name}`, {
        details: { categoryId: data.id }
      });
      queryClient.invalidateQueries({
        queryKey: ['categories']
      });
    },
    onError: (error) => {
      logger.error('Failed to create category', {
        details: { error: String(error) }
      });
    }
  });
}

/**
 * Hook for updating a category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const logger = useLogger('useUpdateCategory', LogCategory.CONTENT);

  return useMutation({
    mutationFn: async (category: Partial<ContentCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', category.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as ContentCategory;
    },
    onSuccess: (data) => {
      logger.info(`Category updated: ${data.name}`, {
        details: { categoryId: data.id }
      });
      queryClient.invalidateQueries({
        queryKey: ['categories']
      });
    },
    onError: (error) => {
      logger.error('Failed to update category', {
        details: { error: String(error) }
      });
    }
  });
}

/**
 * Hook for deleting a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const logger = useLogger('useDeleteCategory', LogCategory.CONTENT);

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      logger.info(`Category deleted`, {
        details: { categoryId: id }
      });
      queryClient.invalidateQueries({
        queryKey: ['categories']
      });
    },
    onError: (error) => {
      logger.error('Failed to delete category', {
        details: { error: String(error) }
      });
    }
  });
}
