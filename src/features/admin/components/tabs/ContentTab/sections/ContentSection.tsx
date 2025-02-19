
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentManagement } from './management/ContentManagement';
import { CategoryManagement } from './categories/CategoryManagement';
import { WorkflowManagement } from './workflows/WorkflowManagement';
import { GalleryManagement } from './gallery/GalleryManagement';
import { BuildManagement } from './builds/BuildManagement';
import { ThemeDataStream } from '@/components/theme/ThemeDataStream';

export const ContentSection = () => {
  const [activeSection, setActiveSection] = useState('content');

  return (
    <div className="relative min-h-[600px] rounded-lg overflow-hidden">
      <ThemeDataStream className="opacity-10" />
      
      <Tabs value={activeSection} onValueChange={setActiveSection} defaultValue="content">
        <Card className="cyber-card bg-background/50 border border-primary/20">
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

        <div className="mt-6">
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>
          
          <TabsContent value="workflows">
            <WorkflowManagement />
          </TabsContent>
          
          <TabsContent value="gallery">
            <GalleryManagement />
          </TabsContent>
          
          <TabsContent value="builds">
            <BuildManagement />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
