
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { CategoryTree } from './CategoryTree';
import { slugify } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { CategoryTreeItem, ContentCategory } from '../../types/content';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const CategoryManagement = () => {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = React.useState({
    name: '',
    description: '',
    parentId: null as string | null
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['content-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return buildCategoryTree(data as ContentCategory[]);
    }
  });

  const createCategory = useMutation({
    mutationFn: async (categoryData: Partial<ContentCategory>) => {
      const { data, error } = await supabase
        .from('content_categories')
        .insert([{
          name: categoryData.name,
          slug: slugify(categoryData.name || ''),
          description: categoryData.description,
          parent_id: categoryData.parent_id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-categories'] });
      setNewCategory({ name: '', description: '', parentId: null });
      toast({
        title: "Category Created",
        description: "The category has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create category: " + error.message,
        variant: "destructive",
      });
    }
  });

  const buildCategoryTree = (categories: ContentCategory[]): CategoryTreeItem[] => {
    const categoryMap = new Map<string, CategoryTreeItem>();
    const roots: CategoryTreeItem[] = [];

    // First pass: Create all category nodes
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: Build the tree structure
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate({
      name: newCategory.name,
      description: newCategory.description,
      parent_id: newCategory.parentId
    });
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-gradient text-2xl font-heading">
          Category Management
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Create and organize content categories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Input
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className="mad-scientist-hover"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Category Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                className="mad-scientist-hover"
              />
            </div>
          </div>
          <Button type="submit" className="mad-scientist-hover">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Category Structure</h3>
          {isLoading ? (
            <div>Loading categories...</div>
          ) : (
            <CategoryTree categories={categories || []} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
