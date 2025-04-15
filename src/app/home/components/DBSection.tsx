
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';

interface DBSectionProps {
  data?: Array<{
    id: string;
    name: string;
    description: string | null;
  }> | null;
}

export const DBSection: React.FC<DBSectionProps> = ({ data }) => {
  // Fix the type issue with null vs undefined in map function
  // Convert null to undefined for compatibility
  const items = data?.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || undefined
  })) || [];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Database Items</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length > 0 ? (
            items.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.description || 'No description available.'}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No database items found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DBSection;
