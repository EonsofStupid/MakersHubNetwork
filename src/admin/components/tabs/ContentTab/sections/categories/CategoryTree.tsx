
import { CategoryData } from '../../types/content.types';

interface CategoryTreeProps {
  categories: CategoryData[];
  onSelect?: (category: CategoryData) => void;
}

export const CategoryTree = ({ categories, onSelect }: CategoryTreeProps) => {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="pl-4">
          <button
            onClick={() => onSelect?.(category)}
            className="hover:text-primary transition-colors"
          >
            {category.name}
          </button>
          {category.children && category.children.length > 0 && (
            <CategoryTree categories={category.children} onSelect={onSelect} />
          )}
        </div>
      ))}
    </div>
  );
};
