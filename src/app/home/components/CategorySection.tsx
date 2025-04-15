
import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
}

interface CategorySectionProps {
  className?: string;
}

export function CategorySection({ className }: CategorySectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('printer_part_categories')
          .select('*')
          .order('name')
          .limit(6);
          
        if (error) throw error;
        
        setCategories(data as Category[]);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback content
        setCategories([
          { id: '1', name: 'Extruders', slug: 'extruders', description: 'High performance extruders for all printer types' },
          { id: '2', name: 'Hot Ends', slug: 'hot-ends', description: 'Precision hot ends for perfect extrusion' },
          { id: '3', name: 'Linear Rails', slug: 'linear-rails', description: 'Smooth motion for precision prints' },
          { id: '4', name: 'Control Boards', slug: 'control-boards', description: 'Next-gen electronics for your printer' },
          { id: '5', name: 'Build Plates', slug: 'build-plates', description: 'Superior adhesion and release' },
          { id: '6', name: 'Enclosures', slug: 'enclosures', description: 'Temperature control for perfect prints' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <section className={cn("py-16 container mx-auto", className)}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Browse Categories</h2>
          <div className="h-2 w-40 bg-primary/20 mx-auto rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-32 bg-muted/40 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 container mx-auto", className)}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Browse Categories</h2>
        <p className="text-muted-foreground">Find printer parts by category</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <a 
            key={category.id} 
            href={`/categories/${category.slug}`}
            className={cn(
              "group relative overflow-hidden rounded-lg border border-primary/10",
              "bg-card hover:border-primary/30 transition-all h-32 flex items-center justify-center",
              "hover:shadow-lg hover:shadow-primary/5"
            )}
          >
            {category.image_url && (
              <div 
                className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity"
                style={{
                  backgroundImage: `url(${category.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            )}
            <div className="relative z-10 text-center p-4">
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
