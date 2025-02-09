
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentList } from './ContentTab/components/ContentList';
import { ContentFilters } from './ContentTab/components/ContentFilter';
import { ContentFilter, ContentItem } from '../types/content';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ContentTab = () => {
  const [filter, setFilter] = useState<ContentFilter>({});
  const { toast } = useToast();

  const handleEdit = (item: ContentItem) => {
    // TODO: Implement edit functionality
    toast({
      title: "Edit Content",
      description: `Editing ${item.title}`,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Content Deleted",
        description: "The content has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage your platform's content and media</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ContentFilters filter={filter} onFilterChange={setFilter} />
        <ContentList
          filter={filter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
