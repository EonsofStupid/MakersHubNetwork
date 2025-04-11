
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  inspectorVisibleAtom, 
  inspectorPositionAtom,
  inspectorComponentAtom,
  inspectorTabAtom
} from '@/admin/store/atoms/inspector.atoms';
import { X, Code, Paintbrush, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ComponentInspector() {
  const [isVisible, setIsVisible] = useAtom(inspectorVisibleAtom);
  const [position, setPosition] = useAtom(inspectorPositionAtom);
  const [componentId, setComponentId] = useAtom(inspectorComponentAtom);
  const [activeTab, setActiveTab] = useAtom(inspectorTabAtom);
  const [componentData, setComponentData] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isVisible || !componentId) return;

    // In a real app, you would fetch component data from a store or API
    // For now, we'll just use mock data
    setComponentData({
      id: componentId,
      name: componentId.split('-')[0],
      styles: {
        color: 'var(--impulse-primary)',
        background: 'var(--impulse-bg-card)',
        padding: '1rem',
        borderRadius: '0.5rem'
      },
      data: {
        source: 'Static',
        lastUpdated: new Date().toISOString()
      }
    });

  }, [componentId, isVisible]);

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    setComponentId(null);
  };
  
  // Handle tab change with proper type casting
  const handleTabChange = (value: string) => {
    if (value === 'styles' || value === 'data' || value === 'rules') {
      setActiveTab(value);
    }
  };

  // Add global mouse event handlers for dragging
  useEffect(() => {
    if (!isVisible) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isVisible, setPosition]);

  if (!isVisible || !componentData) {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed z-50 w-80 bg-background/95 backdrop-blur-md border border-primary/30",
        "rounded-lg shadow-lg shadow-primary/10 overflow-hidden",
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      )}
      style={{ 
        top: `${position.y}px`, 
        left: `${position.x}px`
      }}
    >
      <div 
        className="flex items-center justify-between p-2 bg-primary/10 border-b border-primary/20"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-sm font-medium text-primary">
          {componentData.name}
        </h3>
        <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="styles" className="flex-1">
            <Paintbrush className="h-4 w-4 mr-1" />
            Styles
          </TabsTrigger>
          <TabsTrigger value="data" className="flex-1">
            <Database className="h-4 w-4 mr-1" />
            Data
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex-1">
            <Code className="h-4 w-4 mr-1" />
            Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="styles" className="p-3 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground">Applied Styles</h4>
            <pre className="text-xs bg-background/50 p-2 rounded border border-primary/10 overflow-x-auto">
              {JSON.stringify(componentData.styles, null, 2)}
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="p-3 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground">Component Data</h4>
            <pre className="text-xs bg-background/50 p-2 rounded border border-primary/10 overflow-x-auto">
              {JSON.stringify(componentData.data, null, 2)}
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="rules" className="p-3 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground">Validation Rules</h4>
            <p className="text-xs text-muted-foreground">No rules configured for this component.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
