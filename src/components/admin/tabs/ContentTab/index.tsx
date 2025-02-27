
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentManagement } from '@/components/admin/cms/components/content/ContentManagement';
import { motion } from 'framer-motion';

const ContentTab = () => {
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
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ContentTab;
