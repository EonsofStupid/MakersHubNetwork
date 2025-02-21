
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryManagement } from "@/admin/components/content/categories/CategoryManagement";
import { ContentManagement } from "@/admin/components/content/management/ContentManagement";
import { WorkflowManagement } from "@/admin/components/content/workflows/WorkflowManagement";
import { GalleryManagement } from "@/admin/components/content/gallery/GalleryManagement";
import { BuildManagement } from "@/admin/components/content/builds/BuildManagement";
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
          <TabsList className="w-full justify-start border-b border-primary/20 rounded-none px-4">
            <TabsTrigger value="management">Content Management</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="builds">Builds</TabsTrigger>
          </TabsList>

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
