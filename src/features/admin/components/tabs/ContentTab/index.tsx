
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

// Placeholder components until we implement them
const ContentManagement = () => (
  <Card className="p-6">
    <h3 className="text-xl font-heading font-bold mb-4">Content Management</h3>
    <p className="text-muted-foreground">Content management features coming soon...</p>
  </Card>
);

const CategoryManagement = () => (
  <Card className="p-6">
    <h3 className="text-xl font-heading font-bold mb-4">Category Management</h3>
    <p className="text-muted-foreground">Category management features coming soon...</p>
  </Card>
);

const WorkflowManagement = () => (
  <Card className="p-6">
    <h3 className="text-xl font-heading font-bold mb-4">Workflow Management</h3>
    <p className="text-muted-foreground">Workflow management features coming soon...</p>
  </Card>
);

const GalleryManagement = () => (
  <Card className="p-6">
    <h3 className="text-xl font-heading font-bold mb-4">Gallery Management</h3>
    <p className="text-muted-foreground">Gallery management features coming soon...</p>
  </Card>
);

const BuildManagement = () => (
  <Card className="p-6">
    <h3 className="text-xl font-heading font-bold mb-4">Build Management</h3>
    <p className="text-muted-foreground">Build management features coming soon...</p>
  </Card>
);

export const ContentTab = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[600px] rounded-lg"
      >
        <Tabs defaultValue="content" className="space-y-6">
          <Card className="cyber-card bg-background/50 backdrop-blur-sm border border-primary/20">
            <TabsList className="w-full justify-start border-b border-primary/20 rounded-none px-4">
              <TabsTrigger 
                value="content"
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

          <TabsContent value="content">
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
