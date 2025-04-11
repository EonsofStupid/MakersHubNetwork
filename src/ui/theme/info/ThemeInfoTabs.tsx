
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';
import { ThemeInfoTab } from './ThemeInfoTab';
import { SettingsIcon, PaletteIcon, SearchCodeIcon } from 'lucide-react';
import { ThemeComponentPreview } from '../ThemeComponentPreview';

export function ThemeInfoTabs() {
  return (
    <Tabs defaultValue="config" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="config" className="flex gap-1 items-center">
          <SettingsIcon className="w-4 h-4" />
          <span>Configuration</span>
        </TabsTrigger>
        <TabsTrigger value="colors" className="flex gap-1 items-center">
          <PaletteIcon className="w-4 h-4" />
          <span>Color Palette</span>
        </TabsTrigger>
        <TabsTrigger value="components" className="flex gap-1 items-center">
          <SearchCodeIcon className="w-4 h-4" />
          <span>Components</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="config" className="space-y-4">
        <ThemeInfoTab />
      </TabsContent>
      
      <TabsContent value="colors" className="space-y-4">
        {/* Color palette information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-4 rounded bg-primary text-primary-foreground flex items-center justify-center">Primary</div>
          <div className="p-4 rounded bg-secondary text-secondary-foreground flex items-center justify-center">Secondary</div>
          <div className="p-4 rounded bg-accent text-accent-foreground flex items-center justify-center">Accent</div>
          <div className="p-4 rounded bg-muted text-muted-foreground flex items-center justify-center">Muted</div>
        </div>
      </TabsContent>
      
      <TabsContent value="components" className="space-y-4">
        <ThemeComponentPreview />
      </TabsContent>
    </Tabs>
  );
}
