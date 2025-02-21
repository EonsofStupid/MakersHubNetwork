
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CategoryTreeItem, ContentCategory } from '../types/content';
import { cmsKeys } from './keys';
import { toast } from '@/hooks/use-toast';
import { slugify } from '@/lib/utils';

const buildCategoryTree = (categories: ContentCategory[]): CategoryTreeItem[] => {
  const categoryMap = new Map<string, CategoryTreeItem>();
  const roots: CategoryTreeItem[] = [];

  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  categories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id)!;
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(categoryWithChildren);
      }
    } else {
      roots.push(categoryWithChildren);
    }
  });

  return roots;
};

export const useCategories = () => {
  return useQuery({
    queryKey: cmsKeys.categories.tree(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return buildCategoryTree(data as ContentCategory[]);
    },
  });
};

interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: string | null;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      const slug = slugify(data.name);
      
      // Check for existing category with same slug
      const { data: existing } = await supabase
        .from('content_categories')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        throw new Error('A category with this name already exists');
      }

      const { data: newCategory, error } = await supabase
        .from('content_categories')
        .insert({
          name: data.name,
          slug,
          description: data.description,
          parent_id: data.parentId,
        })
        .select()
        .single();

      if (error) throw error;
      return newCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.categories.all() });
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

interface UpdateCategoryData {
  id: string;
  name?: string;
  description?: string;
  parentId?: string | null;
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCategoryData) => {
      const updates: Partial<ContentCategory> = {};
      
      if (data.name) {
        const slug = slugify(data.name);
        // Check for existing category with same slug
        const { data: existing } = await supabase
          .from('content_categories')
          .select('id')
          .eq('slug', slug)
          .neq('id', id)
          .maybeSingle();

        if (existing) {
          throw new Error('A category with this name already exists');
        }
        updates.name = data.name;
        updates.slug = slug;
      }

      if (data.description !== undefined) {
        updates.description = data.description;
      }

      if (data.parentId !== undefined) {
        updates.parent_id = data.parentId;
      }

      const { error } = await supabase
        .from('content_categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.categories.all() });
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
      queryClient.invalidateQueries({ queryKey: cmsKeys.categories.all() });
      toast({
        title: "Category Deleted",
        description: "The category has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete category: " + error.message,
        variant: "destructive",
      });
    },
  });
};
