import React from 'react';
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type PostCategory = Database["public"]["Enums"]["post_category"];

interface SEOSectionProps {
  selectedCategory: PostCategory | null;
  onCategorySelect: (category: PostCategory) => void;
}

const CATEGORIES = [
  'Guides',
  'Reviews',
  'Blog',
  'Site Updates',
  'Critical',
  '3D Printer',
  '3D Printer Hardware'
] as const;

const SEOSection: React.FC<SEOSectionProps> = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={cn(
                "flex items-center justify-between px-4 py-2 rounded-md border transition-all duration-300",
                selectedCategory === category
                  ? "border-neon-cyan bg-neon-cyan/10 text-white"
                  : "border-white/10 hover:border-neon-cyan/50 text-white/70 hover:text-white"
              )}
            >
              <span>{category}</span>
              {selectedCategory === category && (
                <Check className="w-4 h-4 text-neon-cyan animate-fade-in" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SEOSection;