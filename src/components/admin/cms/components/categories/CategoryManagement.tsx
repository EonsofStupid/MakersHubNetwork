
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Folder, PenLine, Trash2 } from 'lucide-react';
import { CategoryTree } from './CategoryTree';
import { CategoryTreeItem } from '../../types/content';
import { useContentCategories } from '../../queries/useContentCategories';

export const CategoryManagement = () => {
  const { data: categoryTree = [], isLoading } = useContentCategories();
  const [selectedCategory, setSelectedCategory] = useState<CategoryTreeItem | null>(null);

  const handleSelectCategory = (category: CategoryTreeItem) => {
    setSelectedCategory(category);
  };

  const handleAddCategory = () => {
    // Will implement in the next steps
    console.log('Add category');
  };

  const handleEditCategory = () => {
    // Will implement in the next steps
    console.log('Edit category', selectedCategory?.id);
  };

  const handleDeleteCategory = () => {
    // Will implement in the next steps
    console.log('Delete category', selectedCategory?.id);
  };

  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Category Management
            </CardTitle>
            <CardDescription>
              Organize your content with hierarchical categories
            </CardDescription>
          </div>
          <Button 
            onClick={handleAddCategory}
            className="relative group hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Category Tree */}
          <div className="md:col-span-2 border rounded-md p-4 bg-background/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
            </div>
            
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading categories...
              </div>
            ) : (
              <CategoryTree 
                categories={categoryTree}
                onSelectCategory={handleSelectCategory}
                selectedCategoryId={selectedCategory?.id}
              />
            )}
          </div>
          
          {/* Category Details */}
          <div className="md:col-span-3 border rounded-md p-4 bg-background/30">
            {selectedCategory ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Folder className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="text-xl font-semibold">{selectedCategory.name}</h3>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleEditCategory}
                    >
                      <PenLine className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={handleDeleteCategory}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                    <p className="text-sm">
                      {selectedCategory.description || 'No description available.'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Slug</h4>
                    <p className="text-sm font-mono bg-secondary/10 px-2 py-1 rounded">
                      {selectedCategory.slug}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Folder className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a category to view details</p>
                <p className="text-sm mt-2">
                  Or create a new category to organize your content.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddCategory}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
