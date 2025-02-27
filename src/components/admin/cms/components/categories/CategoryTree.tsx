
import { useState } from 'react';
import { ChevronRight, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryTreeItem } from '../../types/content';

interface CategoryTreeProps {
  categories: CategoryTreeItem[];
  onSelectCategory: (category: CategoryTreeItem) => void;
  selectedCategoryId?: string;
}

export const CategoryTree = ({ categories, onSelectCategory, selectedCategoryId }: CategoryTreeProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategories = (items: CategoryTreeItem[], level = 0) => {
    if (!items || items.length === 0) {
      return (
        <div className="py-4 text-center text-muted-foreground">
          <FolderTree className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No categories found</p>
        </div>
      );
    }

    return items.map(category => (
      <div key={category.id} className="my-1">
        <div 
          className={`flex items-center px-2 py-1.5 rounded-md hover:bg-primary/10 transition-colors ${
            selectedCategoryId === category.id ? 'bg-primary/20 text-primary' : ''
          }`}
          style={{ paddingLeft: `${(level * 12) + 8}px` }}
        >
          {category.children && category.children.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category.id);
              }}
            >
              <ChevronRight 
                className={`h-4 w-4 transition-transform ${
                  expandedCategories[category.id] ? 'transform rotate-90' : ''
                }`} 
              />
            </Button>
          )}
          
          <span 
            className="truncate cursor-pointer flex-1"
            onClick={() => onSelectCategory(category)}
          >
            {category.name}
          </span>
        </div>
        
        {category.children && expandedCategories[category.id] && (
          <div>
            {renderCategories(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="overflow-y-auto max-h-[400px] pr-2">
      {renderCategories(categories)}
    </div>
  );
};
