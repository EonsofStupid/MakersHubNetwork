
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Theme, ThemeEffect } from '@/types/theme';

interface ThemeColorSystemProps {
  tokens: any[];
}

// Simple placeholder component
const ThemeColorSystem: React.FC<ThemeColorSystemProps> = () => {
  return <div>Color System Placeholder</div>;
};

// Simple placeholder component for EffectsPreview
const EffectsPreview: React.FC<{effect?: ThemeEffect}> = () => {
  return <div>Effects Preview Placeholder</div>;
};

interface ThemeInfoTabsProps {
  theme: Theme;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const ThemeInfoTabs: React.FC<ThemeInfoTabsProps> = ({
  theme,
  activeTab = 'details',
  onTabChange
}) => {
  // Mock effect for preview
  const mockEffect: ThemeEffect = {
    type: 'glow',
    enabled: true,
    intensity: 0.5
  };
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={value => onTabChange?.(value)}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="colors">Colors</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
        <TabsTrigger value="effects">Effects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="mt-4">
        {/* Details content */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Name:</span>
            <span>{theme.name}</span>
          </div>
          {theme.description && (
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Description:</span>
              <span>{theme.description}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Dark Mode:</span>
            <span>{theme.isDark ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="colors" className="mt-4">
        <ScrollArea className="h-[400px]">
          <ThemeColorSystem tokens={[]} />
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="components" className="mt-4">
        <p className="text-sm text-center py-4">No component information available</p>
      </TabsContent>
      
      <TabsContent value="effects" className="mt-4">
        <EffectsPreview effect={mockEffect} />
      </TabsContent>
    </Tabs>
  );
};

export default ThemeInfoTabs;
