
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentCategory, CategoryTreeItem } from '../types/content';
import { cmsKeys } from './keys';

// Helper function to build a tree from flat array
const buildCategoryTree = (categories: ContentCategory[]): CategoryTreeItem[] => {
  const categoryMap: Record<string, CategoryTreeItem> = {};
  const roots: CategoryTreeItem[] = [];

  // First pass: create map of ID -> category
  categories.forEach(category => {
    categoryMap[category.id] = { ...category, children: [] };
  });

  // Second pass: build the tree
  categories.forEach(category => {
    const node = categoryMap[category.id];
    
    if (category.parent_id && categoryMap[category.parent_id]) {
      // If it has a parent, add it to the parent's children
      categoryMap[category.parent_id].children?.push(node);
    } else {
      // If no parent, it's a root node
      roots.push(node);
    }
  });

  return roots;
};

export const useContentCategories = () => {
  return useQuery({
    queryKey: cmsKeys.categories.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as ContentCategory[];
    },
  });
};

export const useCategoryTree = () => {
  return useQuery({
    queryKey: cmsKeys.categories.tree(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      const categories = data as ContentCategory[];
      const categoryTree = buildCategoryTree(categories);
      
      return categoryTree;
    },
  });
};
