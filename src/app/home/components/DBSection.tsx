
import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { supabase } from '@/integrations/supabase/client';

interface DBItem {
  id: string;
  name: string;
  description?: string;
}

interface DBSectionProps {
  className?: string;
}

export function DBSection({ className }: DBSectionProps) {
  const [items, setItems] = useState<DBItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      setIsLoading(true);
      try {
        // This is a placeholder. In a real app, you'd fetch from another table
        // For now, we'll use blog_categories as a placeholder
        const { data, error } = await supabase
          .from('blog_categories')
          .select('id, name, description')
          .limit(4);
          
        if (error) throw error;
        
        setItems(data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description
        })));
      } catch (error) {
        console.error('Error loading DB items:', error);
        // Fallback content
        setItems([
          {
            id: '1',
            name: 'Database Item 1',
            description: 'This is a placeholder for database content'
          },
          {
            id: '2',
            name: 'Database Item 2',
            description: 'When fully implemented, this section will show actual database records'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadItems();
  }, []);

  if (isLoading) {
    return (
      <section className={cn("py-16 px-4 container mx-auto", className)}>
        <h2 className="text-3xl font-bold mb-8 text-center">Database Items</h2>
        <div className="flex justify-center">
          <div className="h-24 w-64 bg-muted/40 rounded-lg animate-pulse"></div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-16 px-4 container mx-auto", className)}>
      <h2 className="text-3xl font-bold mb-8 text-center">Database Items</h2>
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-primary/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 p-4 font-semibold border-b border-primary/10">
            <div>ID</div>
            <div>Name</div>
            <div>Description</div>
          </div>
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-3 p-4 border-b border-primary/5 hover:bg-primary/5">
              <div className="truncate">{item.id.slice(0, 8)}...</div>
              <div className="font-medium">{item.name}</div>
              <div className="text-muted-foreground">{item.description || 'No description'}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            This section demonstrates dynamic database content rendering
          </p>
        </div>
      </div>
    </section>
  );
}
