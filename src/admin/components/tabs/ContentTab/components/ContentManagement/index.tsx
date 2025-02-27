
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ContentList } from './ContentList';
import { ContentFilters } from './ContentFilters';
import { useState } from 'react';
import { ContentFilter } from '@/admin/types/content';
import { useContentTypes } from '@/admin/queries/useContentTypes';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const ContentManagement = () => {
  const [filter, setFilter] = useState<ContentFilter>({});
  const { data: contentTypes = [] } = useContentTypes();

  const handleCreateContent = () => {
    // TODO: Implement content creation
    console.log('Create content clicked');
  };

  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Content Management
            </CardTitle>
            <CardDescription>
              Create and manage your platform's content
            </CardDescription>
          </div>
          <Button 
            onClick={handleCreateContent}
            className="glass-morphism"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ContentFilters 
          contentTypes={contentTypes}
          currentFilter={filter}
          onFilterChange={setFilter}
        />
        <ContentList 
          filter={filter}
          contentTypes={contentTypes}
        />
      </CardContent>
    </Card>
  );
};
