
import React from 'react';
import { useAtom } from 'jotai';
import { 
  inspectedComponentAtom,
  inspectorTabAtom,
  inspectorVisibleAtom,
  inspectorPositionAtom 
} from '@/admin/store/atoms/inspector.atoms';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { X } from 'lucide-react';

export function ComponentInspector() {
  const [inspectedComponent] = useAtom(inspectedComponentAtom);
  const [inspectorTab, setInspectorTab] = useAtom(inspectorTabAtom);
  const [isVisible, setIsVisible] = useAtom(inspectorVisibleAtom);
  const [position] = useAtom(inspectorPositionAtom);

  if (!isVisible || !inspectedComponent) return null;

  const handleTabChange = (value: string) => {
    setInspectorTab(value);
  };

  return (
    <div 
      className="fixed z-50 bg-background border border-border rounded-md shadow-lg w-80"
      style={{
        top: position?.y || 100,
        left: position?.x || 100,
      }}
    >
      <div className="p-2 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium">Inspector: {inspectedComponent}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue={inspectorTab} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
          <TabsTrigger value="props" className="flex-1">Props</TabsTrigger>
          <TabsTrigger value="state" className="flex-1">State</TabsTrigger>
        </TabsList>
        
        <TabsContent value="styles" className="p-2">
          <p className="text-xs">Styles inspector will show here</p>
        </TabsContent>
        
        <TabsContent value="props" className="p-2">
          <p className="text-xs">Props inspector will show here</p>
        </TabsContent>
        
        <TabsContent value="state" className="p-2">
          <p className="text-xs">State inspector will show here</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
