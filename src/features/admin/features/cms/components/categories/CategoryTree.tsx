
import React from 'react';
import { ChevronRight, ChevronDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryTreeItem } from '../../types/content';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CategoryTreeProps {
  categories: CategoryTreeItem[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, updates: { name?: string; description?: string }) => Promise<void>;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({ categories, onDelete, onEdit }) => {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = React.useState<CategoryTreeItem | null>(null);
  const [deletingCategory, setDeletingCategory] = React.useState<CategoryTreeItem | null>(null);
  const [editForm, setEditForm] = React.useState({ name: '', description: '' });

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expanded);
    if (expanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpanded(newExpanded);
  };

  const handleEdit = (category: CategoryTreeItem) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      description: category.description || '',
    });
  };

  const handleEditSubmit = async () => {
    if (!editingCategory) return;
    
    await onEdit(editingCategory.id, {
      name: editForm.name,
      description: editForm.description,
    });
    
    setEditingCategory(null);
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    await onDelete(deletingCategory.id);
    setDeletingCategory(null);
  };

  const renderCategory = (category: CategoryTreeItem, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expanded.has(category.id);

    return (
      <div key={category.id} className="category-item">
        <div 
          className="flex items-center py-2 hover:bg-muted/50 rounded-lg px-2"
          style={{ marginLeft: `${level * 20}px` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 hover:bg-transparent"
              onClick={() => toggleExpand(category.id)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          )}
          
          <span className="flex-1 ml-2">{category.name}</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDeletingCategory(category)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="category-children">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="category-tree border rounded-lg p-4">
      {categories.map(category => renderCategory(category))}

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the category details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{deletingCategory?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
