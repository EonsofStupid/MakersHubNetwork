
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ContentTypeManager } from './ContentTypeManager';
import { ContentFilters } from './ContentFilter';
import { ContentList } from './ContentList';
import { useState } from 'react';
import { ContentFilter } from '../../types/content';
import { useContentTypes } from '../../queries/useContentTypes';

export const ContentManagement = () => {
  const [filter, setFilter] = useState<ContentFilter>({});
  const { data: contentTypes } = useContentTypes();

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
          <ContentTypeManager />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ContentFilters 
          contentTypes={contentTypes || []}
          currentFilter={filter}
          onFilterChange={setFilter}
        />
        <ContentList 
          filter={filter}
          contentTypes={contentTypes || []}
        />
      </CardContent>
    </Card>
  );
};
