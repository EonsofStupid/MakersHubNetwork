
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryTree } from './components/CategoryTree';
import { CategoryForm } from './components/CategoryForm';
import { CategoryTreeItem } from '@/admin/types/content';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/admin/queries/content/useCategories';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const CategoryManagement = () => {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTreeItem | undefined>();
  const [parentId, setParentId] = useState<string | undefined>();

  const handleAdd = (parentId?: string) => {
    setParentId(parentId);
    setSelectedCategory(undefined);
    setFormOpen(true);
  };

  const handleEdit = (category: CategoryTreeItem) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category: CategoryTreeItem) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: { name: string; description?: string }) => {
    if (selectedCategory) {
      await updateCategory.mutateAsync({
        id: selectedCategory.id,
        ...data,
        parentId: selectedCategory.parent_id,
      });
    } else {
      await createCategory.mutateAsync({
        ...data,
        parentId,
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      await deleteCategory.mutateAsync(selectedCategory.id);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Category Management
        </CardTitle>
        <CardDescription>
          Organize your content with categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryTree
          categories={categories}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <CategoryForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleSubmit}
          initialData={selectedCategory}
          title={selectedCategory ? 'Edit Category' : 'Create Category'}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the category "{selectedCategory?.name}".
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
