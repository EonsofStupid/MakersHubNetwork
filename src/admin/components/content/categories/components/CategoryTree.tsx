
import { CategoryTreeItem } from '@/admin/types/content';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Plus, Edit, Trash } from 'lucide-react';
import { useState } from 'react';

interface CategoryTreeProps {
  categories: CategoryTreeItem[];
  onAdd?: (parentId?: string) => void;
  onEdit?: (category: CategoryTreeItem) => void;
  onDelete?: (category: CategoryTreeItem) => void;
}

export const CategoryTree = ({ 
  categories,
  onAdd,
  onEdit,
  onDelete
}: CategoryTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderCategory = (category: CategoryTreeItem) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expanded[category.id];

    return (
      <div key={category.id} className="space-y-2">
        <div className="flex items-center gap-2 group">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => toggleExpand(category.id)}
          >
            {hasChildren && (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          </Button>
          
          <span className="flex-grow">{category.name}</span>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onAdd?.(category.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onEdit?.(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive"
              onClick={() => onDelete?.(category)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-6 space-y-2 border-l-2 border-primary/20 pl-4">
            {category.children.map(child => renderCategory(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => onAdd?.(undefined)}
        className="w-full justify-start"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Root Category
      </Button>
      <div className="space-y-2">
        {categories.map(category => renderCategory(category))}
      </div>
    </div>
  );
};
