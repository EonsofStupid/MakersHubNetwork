
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentManagement } from './sections/management/ContentManagement';
import { CategoryManagement } from './sections/categories/CategoryManagement';
import { WorkflowManagement } from './sections/workflows/WorkflowManagement';
import { GalleryManagement } from './sections/gallery/GalleryManagement';
import { BuildManagement } from './sections/builds/BuildManagement';
import { ThemeDataStream } from '@/components/theme/ThemeDataStream';

export const ContentSection = () => {
  const [activeSection, setActiveSection] = useState('content');

  return (
    <div className="relative min-h-[600px] rounded-lg overflow-hidden space-y-6">
      <ThemeDataStream className="opacity-10" />
      
      <Card className="cyber-card bg-background/50 border border-primary/20">
        <TabsList className="w-full justify-start border-b border-primary/20 rounded-none px-4">
          <TabsTrigger 
            value="content"
            onClick={() => setActiveSection('content')}
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Content Management
          </TabsTrigger>
          <TabsTrigger 
            value="categories"
            onClick={() => setActiveSection('categories')}
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger 
            value="workflows"
            onClick={() => setActiveSection('workflows')}
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Workflows
          </TabsTrigger>
          <TabsTrigger 
            value="gallery"
            onClick={() => setActiveSection('gallery')}
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Gallery
          </TabsTrigger>
          <TabsTrigger 
            value="builds"
            onClick={() => setActiveSection('builds')}
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Builds
          </TabsTrigger>
        </TabsList>
      </Card>

      <div className="space-y-6">
        {activeSection === 'content' && <ContentManagement />}
        {activeSection === 'categories' && <CategoryManagement />}
        {activeSection === 'workflows' && <WorkflowManagement />}
        {activeSection === 'gallery' && <GalleryManagement />}
        {activeSection === 'builds' && <BuildManagement />}
      </div>
    </div>
  );
};
