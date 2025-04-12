import React, { useState, useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { supabase } from '@/auth/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';

// Add slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  order?: number;
  created_at: string;
  updated_at: string;
}

// Export named component, not default
export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const logger = useLogger('CategoryManagement', LogCategory.CONTENT);
  const { hasPermission } = useAdminPermissions();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        setError(error.message);
        logger.error('Failed to fetch categories', { 
          details: { error: error.message } 
        });
      } else {
        setCategories(data || []);
      }
    } catch (err) {
      setError('Failed to fetch categories');
      logger.error('Failed to fetch categories', { 
        details: { error: String(err) } 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(updatedFields)
        .eq('id', id);

      if (error) {
        toast({
          title: 'Error updating category',
          description: error.message,
          variant: 'destructive',
        });
        logger.error('Failed to update category', { 
          details: { error: error.message } 
        });
      } else {
        toast({
          title: 'Category updated',
          description: 'Category updated successfully.',
        });
        logger.info('Category updated successfully', { 
          details: { categoryId: id } 
        });
        fetchCategories();
      }
    } catch (err) {
      toast({
        title: 'Error updating category',
        description: 'Failed to update category.',
        variant: 'destructive',
      });
      logger.error('Failed to update category', { 
        details: { error: String(err) } 
      });
    } finally {
      setEditingCategory(null);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: 'Error deleting category',
          description: error.message,
          variant: 'destructive',
        });
        logger.error('Failed to delete category', { 
          details: { error: error.message } 
        });
      } else {
        toast({
          title: 'Category deleted',
          description: 'Category deleted successfully.',
        });
        logger.info('Category deleted successfully', { 
          details: { categoryId: id } 
        });
        fetchCategories();
      }
    } catch (err) {
      toast({
        title: 'Error deleting category',
        description: 'Failed to delete category.',
        variant: 'destructive',
      });
      logger.error('Failed to delete category', { 
        details: { error: String(err) } 
      });
    }
  };

  const createCategory = async () => {
    setIsCreating(true);
    const slug = slugify(newCategoryName);
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName, slug: slug, description: newCategoryDescription }]);

      if (error) {
        toast({
          title: 'Error creating category',
          description: error.message,
          variant: 'destructive',
        });
        logger.error('Failed to create category', { 
          details: { error: error.message } 
        });
      } else {
        toast({
          title: 'Category created',
          description: 'Category created successfully.',
        });
        logger.info('Category created successfully', { 
          details: { categoryName: newCategoryName } 
        });
        fetchCategories();
        setNewCategoryName('');
        setNewCategoryDescription('');
      }
    } catch (err) {
      toast({
        title: 'Error creating category',
        description: 'Failed to create category.',
        variant: 'destructive',
      });
      logger.error('Failed to create category', { 
        details: { error: String(err) } 
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Category Management</h2>
        {hasPermission('categories.create') && (
          <div className="mt-4">
            <Input
              type="text"
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="New Category Description"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
            />
            <Button onClick={createCategory} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <TableRow>
                <TableCell>
                  {editingCategory?.id === category.id ? (
                    <Input
                      type="text"
                      defaultValue={category.name}
                      onBlur={(e) => updateCategory(category.id, { name: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  ) : (
                    <button
                      className="flex items-center space-x-2 text-left"
                      onClick={() => toggleRow(category.id)}
                    >
                      {expandedRows.has(category.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span>{category.name}</span>
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory?.id === category.id ? (
                    <Input
                      type="text"
                      defaultValue={category.slug}
                      onBlur={(e) => updateCategory(category.id, { slug: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  ) : (
                    category.slug
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory?.id === category.id ? (
                    <Input
                      type="text"
                      defaultValue={category.description}
                      onBlur={(e) => updateCategory(category.id, { description: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  ) : (
                    category.description
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingCategory?.id === category.id ? (
                    <Button variant="ghost" size="sm" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  ) : (
                    <>
                      {hasPermission('categories.edit') && (
                        <Button variant="ghost" size="sm" onClick={() => startEdit(category)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      {hasPermission('categories.delete') && (
                        <Button variant="ghost" size="sm" onClick={() => deleteCategory(category.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
              {/* Conditionally render expanded content */}
              {expandedRows.has(category.id) && (
                <TableRow>
                  <TableCell colSpan={5} className="p-4">
                    <div className="pl-6">
                      <p>
                        <strong>Created At:</strong> {category.created_at}
                      </p>
                      <p>
                        <strong>Updated At:</strong> {category.updated_at}
                      </p>
                      {/* Add more details here as needed */}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
