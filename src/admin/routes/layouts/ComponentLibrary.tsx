
import React from 'react';
import { ScrollArea } from '@/ui/core/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/core/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/core/accordion';
import { Button } from '@/ui/core/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';
import { Palette, Grid3X3, Layers, Layout, TextCursorInput, FileText } from 'lucide-react';
import componentRegistry from '@/admin/services/componentRegistry';
import { Component } from '@/admin/types/layout.types';
import { v4 as uuidv4 } from 'uuid';

interface ComponentLibraryProps {
  onSelectComponent: (component: Component) => void;
}

export function ComponentLibrary({ onSelectComponent }: ComponentLibraryProps) {
  const allComponents = componentRegistry.getAll();
  
  // Group components by category
  const layoutComponents = Object.entries(allComponents).filter(([id]) => 
    id.includes('Layout') || id.includes('Section') || id.includes('Grid')
  );
  
  const uiComponents = Object.entries(allComponents).filter(([id]) => 
    id.includes('Card') || id.includes('Button') || id === 'span' || id === 'div'
  );
  
  const featureComponents = Object.entries(allComponents).filter(([id]) => 
    !id.includes('Layout') && !id.includes('Section') && !id.includes('Grid') && 
    !id.includes('Card') && !id.includes('Button') && id !== 'span' && id !== 'div'
  );
  
  const handleComponentSelect = (id: string) => {
    const newComponent: Component = {
      id: uuidv4(),
      type: id,
      props: componentRegistry.getRegistration(id)?.defaultProps || {},
      children: [],
    };
    
    onSelectComponent(newComponent);
  };
  
  const renderComponentItem = ([id, registration]: [string, any]) => (
    <Button
      key={id}
      variant="ghost" 
      className="w-full justify-start text-left h-auto py-2 px-3"
      onClick={() => handleComponentSelect(id)}
    >
      <div className="flex items-center gap-2">
        {id.includes('Card') ? <FileText className="h-4 w-4" /> : 
         id.includes('Layout') ? <Layout className="h-4 w-4" /> : 
         id.includes('Grid') ? <Grid3X3 className="h-4 w-4" /> : 
         <TextCursorInput className="h-4 w-4" />}
        <span>{id}</span>
      </div>
    </Button>
  );
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Component Library
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="layout">
          <TabsList className="w-full">
            <TabsTrigger value="layout" className="flex-1">
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="ui" className="flex-1">
              <Layers className="h-4 w-4 mr-2" />
              UI
            </TabsTrigger>
            <TabsTrigger value="features" className="flex-1">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Features
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-260px)]">
            <TabsContent value="layout" className="m-0 p-0">
              <div className="space-y-1 p-2">
                {layoutComponents.map(comp => renderComponentItem(comp))}
              </div>
            </TabsContent>
            
            <TabsContent value="ui" className="m-0 p-0">
              <Accordion type="multiple" defaultValue={["cards", "basic"]}>
                <AccordionItem value="cards">
                  <AccordionTrigger className="px-3">Card Components</AccordionTrigger>
                  <AccordionContent className="space-y-1 pl-4">
                    {uiComponents.filter(([id]) => id.includes('Card')).map(comp => renderComponentItem(comp))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="basic">
                  <AccordionTrigger className="px-3">Basic Elements</AccordionTrigger>
                  <AccordionContent className="space-y-1 pl-4">
                    {uiComponents.filter(([id]) => !id.includes('Card')).map(comp => renderComponentItem(comp))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="features" className="m-0 p-0">
              <div className="space-y-1 p-2">
                {featureComponents.map(comp => renderComponentItem(comp))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
