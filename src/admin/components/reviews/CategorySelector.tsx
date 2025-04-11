
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ReviewCategory } from "@/admin/types/review.types";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategories: ReviewCategory[];
  onChange: (categories: ReviewCategory[]) => void;
  readOnly?: boolean;
  className?: string;
}

const ALL_CATEGORIES: ReviewCategory[] = [
  'Print Quality',
  'Ease of Assembly',
  'Cost Effectiveness',
  'Performance',
  'Customizability',
  'Documentation'
];

export function CategorySelector({
  selectedCategories,
  onChange,
  readOnly = false,
  className
}: CategorySelectorProps) {
  const toggleCategory = (category: ReviewCategory) => {
    if (readOnly) return;
    
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(c => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {ALL_CATEGORIES.map(category => (
        <Badge
          key={category}
          variant={selectedCategories.includes(category) ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-colors",
            !readOnly && "hover:bg-primary/80"
          )}
          onClick={() => toggleCategory(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
