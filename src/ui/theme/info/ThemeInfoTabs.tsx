
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';
import { ThemeInfoTab } from './ThemeInfoTab';
import { ThemeToken } from '@/types/theme';
import { ThemeComponentPreview } from '@/ui/theme/ThemeComponentPreview';

interface ThemeInfoTabsProps {
  componentTokens?: ThemeToken[];
}

export function ThemeInfoTabs({ componentTokens = [] }: ThemeInfoTabsProps) {
  // Filter tokens by component
  const getComponentTokens = (component: string) => {
    return componentTokens.filter(token => token.component === component);
  };

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
        <TabsTrigger value="colors">Colors</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
        <ThemeInfoTab />
      </TabsContent>
      
      <TabsContent value="components" className="space-y-6">
        <ThemeComponentPreview component="Button" componentTokens={getComponentTokens('button')} />
        <ThemeComponentPreview component="Card" componentTokens={getComponentTokens('card')} />
        <ThemeComponentPreview component="Input" componentTokens={getComponentTokens('input')} />
      </TabsContent>
      
      <TabsContent value="colors">
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="flex flex-col space-y-2">
            <div className="w-full h-12 rounded-md bg-primary" />
            <span className="text-xs">Primary</span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-full h-12 rounded-md bg-secondary" />
            <span className="text-xs">Secondary</span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-full h-12 rounded-md bg-muted" />
            <span className="text-xs">Muted</span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-full h-12 rounded-md bg-accent" />
            <span className="text-xs">Accent</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
