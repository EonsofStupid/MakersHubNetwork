
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface CategoryForm {
  name: string;
  description: string;
  parentId: string | null;
}

export const CategoryManagement = () => {
  const queryClient = useQueryClient();
  const form = useForm<CategoryForm>({
    defaultValues: {
      name: '',
      description: '',
      parentId: null
    }
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
    mutationFn: async (categoryData: CategoryForm) => {
      const slug = slugify(categoryData.name);
      
      // Check for duplicate slugs
      const { data: existingCategory } = await supabase
        .from('content_categories')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingCategory) {
        throw new Error('A category with this name already exists');
      }

      const { data, error } = await supabase
        .from('content_categories')
        .insert([{
          name: categoryData.name,
          slug,
          description: categoryData.description,
          parent_id: categoryData.parentId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-categories'] });
      form.reset();
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

  const onSubmit = (data: CategoryForm) => {
    createCategory.mutate(data);
  };

  // Preview slug as user types the name
  const previewSlug = form.watch('name') ? slugify(form.watch('name')) : '';

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="mad-scientist-hover" />
                  </FormControl>
                  {previewSlug && (
                    <FormDescription>
                      URL slug: {previewSlug}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="mad-scientist-hover" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mad-scientist-hover">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </form>
        </Form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Category Structure</h3>
          {isLoading ? (
            <div>Loading categories...</div>
          ) : (
            <CategoryTree 
              categories={categories || []} 
              onDelete={async (id) => {
                const { error } = await supabase
                  .from('content_categories')
                  .delete()
                  .eq('id', id);
                
                if (error) {
                  toast({
                    title: "Error",
                    description: "Failed to delete category",
                    variant: "destructive",
                  });
                  return;
                }

                queryClient.invalidateQueries({ queryKey: ['content-categories'] });
                toast({
                  title: "Category Deleted",
                  description: "The category has been successfully deleted.",
                });
              }}
              onEdit={async (id, updates) => {
                const slug = updates.name ? slugify(updates.name) : undefined;
                
                if (slug) {
                  // Check for duplicate slugs
                  const { data: existingCategory } = await supabase
                    .from('content_categories')
                    .select('id')
                    .eq('slug', slug)
                    .neq('id', id)
                    .single();

                  if (existingCategory) {
                    toast({
                      title: "Error",
                      description: "A category with this name already exists",
                      variant: "destructive",
                    });
                    return;
                  }
                }

                const { error } = await supabase
                  .from('content_categories')
                  .update({ ...updates, slug })
                  .eq('id', id);
                
                if (error) {
                  toast({
                    title: "Error",
                    description: "Failed to update category",
                    variant: "destructive",
                  });
                  return;
                }

                queryClient.invalidateQueries({ queryKey: ['content-categories'] });
                toast({
                  title: "Category Updated",
                  description: "The category has been successfully updated.",
                });
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
