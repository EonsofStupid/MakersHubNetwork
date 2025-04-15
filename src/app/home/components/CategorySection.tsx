
import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
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
          .from('blog_categories')
          .select('id, name, slug, description')
          .order('name', { ascending: true });
          
        if (error) throw error;
        setCategories(data as Category[]);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback content
        setCategories([
          {
            id: '1',
            name: '3D Printer Builds',
            slug: '3d-printer-builds',
            description: 'Full 3D printer builds and assembly guides'
          },
          {
            id: '2',
            name: 'Modifications',
            slug: 'modifications',
            description: 'Upgrades and modifications for existing printers'
          },
          {
            id: '3',
            name: 'Tutorials',
            slug: 'tutorials',
            description: 'Step-by-step guides and tutorials'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <section className={cn("py-16 px-4 container mx-auto", className)}>
        <h2 className="text-3xl font-bold mb-8 text-center">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-muted/40 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-16 px-4 container mx-auto", className)}>
      <h2 className="text-3xl font-bold mb-8 text-center">Explore Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <a 
            key={category.id}
            href={`/category/${category.slug}`}
            className="block p-6 bg-card border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            {category.description && (
              <p className="text-muted-foreground">{category.description}</p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
