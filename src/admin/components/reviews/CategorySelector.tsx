
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ReviewCategory } from "@/admin/types/review.types";
import { cn } from "@/lib/utils";
import { Check, Plus, X } from "lucide-react";

const AVAILABLE_CATEGORIES: ReviewCategory[] = [
  'Print Quality',
  'Ease of Assembly',
  'Cost Effectiveness',
  'Performance',
  'Customizability',
  'Documentation'
];

interface CategorySelectorProps {
  selectedCategories: ReviewCategory[];
  onChange: (categories: ReviewCategory[]) => void;
  readOnly?: boolean;
  className?: string;
}

export function CategorySelector({
  selectedCategories,
  onChange,
  readOnly = false,
  className
}: CategorySelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleCategory = (category: ReviewCategory) => {
    if (readOnly) return;
    
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(c => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {selectedCategories.map(category => (
          <Badge
            key={category}
            variant="secondary"
            className={cn(
              "flex items-center gap-1",
              !readOnly && "pr-1 hover:bg-secondary/80"
            )}
          >
            {category}
            {!readOnly && (
              <button
                onClick={() => toggleCategory(category)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        
        {!readOnly && (
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-muted"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Category
          </Badge>
        )}
      </div>
      
      {isExpanded && !readOnly && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md animate-in fade-in-50 duration-300">
          {AVAILABLE_CATEGORIES.filter(
            category => !selectedCategories.includes(category)
          ).map(category => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer hover:bg-background"
              onClick={() => toggleCategory(category)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {category}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
