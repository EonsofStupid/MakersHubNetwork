
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentList } from './ContentList';
import { ContentFilters } from './ContentFilter';
import { ContentFilter, ContentItem } from '../../types/content';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ThemeDataStream } from '@/components/theme/ThemeDataStream';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryManagement } from '../categories/CategoryManagement';
import { WorkflowManagement } from '../workflow/WorkflowManagement';
import { useDeleteContent } from '../../queries/useContentItems';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const ContentTab = () => {
  const [filter, setFilter] = useState<ContentFilter>({});
  const [activeTab, setActiveTab] = useState('content');
  const { toast } = useToast();
  const deleteContentMutation = useDeleteContent();

  const handleEdit = (item: ContentItem) => {
    toast({
      title: "Edit Content",
      description: `Editing ${item.title}`,
    });
  };

  const handleDelete = async (id: string) => {
    deleteContentMutation.mutate(id);
  };

  return (
    <div className="relative min-h-[600px] rounded-lg overflow-hidden">
      <ThemeDataStream className="opacity-10" />
      
      <Tabs 
        defaultValue="content" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="cyber-card bg-background/50 border border-primary/20">
          <TabsTrigger 
            value="content"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Content
          </TabsTrigger>
          <TabsTrigger 
            value="categories"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger 
            value="workflows"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Workflows
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="content" className="space-y-6">
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
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContentFilters filter={filter} onFilterChange={setFilter} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
          </TabsContent>

          <TabsContent value="categories">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryManagement />
            </motion.div>
          </TabsContent>

          <TabsContent value="workflows">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WorkflowManagement />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};
