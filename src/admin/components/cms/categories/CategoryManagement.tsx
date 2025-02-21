import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCategories, useCreateCategory } from '@/admin/queries/content/useContentCategories';
import { Category } from '@/admin/types/content';

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'parent_id',
    header: 'Parent Category',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleDateString();
    },
  },
];

export const CategoryManagement = () => {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const { toast } = useToast();

  const handleCreateCategory = async () => {
    try {
      await createCategory.mutateAsync({
        name: 'New Category',
        description: 'Description',
      });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <div className="flex items-center justify-between p-6 border-b border-primary/20">
        <div>
          <h2 className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Category Management
          </h2>
          <p className="text-muted-foreground">
            Manage content categories and organization
          </p>
        </div>
        <Button 
          onClick={handleCreateCategory}
          className="relative group hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>
      <div className="p-6">
        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          emptyMessage="No categories found"
        />
      </div>
    </Card>
  );
};
