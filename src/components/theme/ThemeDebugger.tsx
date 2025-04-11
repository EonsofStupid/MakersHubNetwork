
import React from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Theme } from '@/types/theme';

export function ThemeDebugger() {
  const { currentTheme, isLoading } = useThemeStore();
  
  if (isLoading) {
    return <div>Loading theme...</div>;
  }
  
  if (!currentTheme) {
    return <div>No theme loaded</div>;
  }
  
  const themeObj: Theme = currentTheme;
  
  return (
    <div className="p-4 border rounded-md bg-background">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Current Theme</h3>
        <div className="flex space-x-2 mb-2">
          <Badge>{themeObj.id}</Badge>
          <Badge variant="outline">{themeObj.name}</Badge>
          <Badge variant={themeObj.is_default ? "default" : "secondary"}>
            {themeObj.is_default ? "Default" : "Custom"}
          </Badge>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="design-tokens">
          <AccordionTrigger>Design Tokens</AccordionTrigger>
          <AccordionContent>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(themeObj.design_tokens, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="component-tokens">
          <AccordionTrigger>Component Tokens ({themeObj.component_tokens?.length || 0})</AccordionTrigger>
          <AccordionContent>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(themeObj.component_tokens, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => console.log(themeObj)}>
          Log Theme
        </Button>
      </div>
    </div>
  );
}

export default ThemeDebugger;
