
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentManagement } from './sections/management/ContentManagement';
import { CategoryManagement } from './sections/categories/CategoryManagement';
import { WorkflowManagement } from './sections/workflows/WorkflowManagement';
import { GalleryManagement } from './sections/gallery/GalleryManagement';
import { BuildManagement } from './sections/builds/BuildManagement';
import { motion } from 'framer-motion';

export const ContentTab = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[600px] rounded-lg"
      >
        <Tabs defaultValue="management" className="space-y-6">
          <Card className="cyber-card bg-background/50 backdrop-blur-sm border border-primary/20">
            <TabsList className="w-full justify-start border-b border-primary/20 rounded-none px-4">
              <TabsTrigger 
                value="management"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Content Management
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
              <TabsTrigger 
                value="gallery"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Gallery
              </TabsTrigger>
              <TabsTrigger 
                value="builds"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Builds
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="management">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ContentManagement />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="categories">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <CategoryManagement />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="workflows">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <WorkflowManagement />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <GalleryManagement />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="builds">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <BuildManagement />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};
