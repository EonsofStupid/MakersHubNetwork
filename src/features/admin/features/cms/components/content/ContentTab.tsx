
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentList } from './ContentList';
import { ContentFilters } from './ContentFilter';
import { ContentFilter, ContentItem } from '../../types/content';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ThemeDataStream } from '@/components/theme/ThemeDataStream';
import { motion } from 'framer-motion';

export const ContentTab = () => {
  const [filter, setFilter] = useState<ContentFilter>({});
  const { toast } = useToast();

  const handleEdit = (item: ContentItem) => {
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
    <div className="relative min-h-[600px] rounded-lg overflow-hidden">
      <ThemeDataStream className="opacity-10" />
      
      <Card className="relative z-10 cyber-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient text-2xl font-heading">
                Content Management
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your platform's content and media
              </CardDescription>
            </div>
            <Button className="mad-scientist-hover">
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ContentFilters filter={filter} onFilterChange={setFilter} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContentList
              filter={filter}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};
