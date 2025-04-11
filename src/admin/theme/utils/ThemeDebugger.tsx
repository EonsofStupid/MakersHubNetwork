
import React from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { Badge } from '@/ui/core/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/core/accordion';
import { Button } from '@/ui/core/button';
import { Theme } from '@/types/theme';

export function ThemeDebugger() {
  const { currentTheme, adminComponents, isLoading } = useThemeStore();
  
  if (isLoading) {
    return <div>Loading theme...</div>;
  }
  
  if (!currentTheme) {
    return <div>No theme loaded</div>;
  }
  
  return (
    <div className="p-4 border rounded-md bg-background">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Current Theme</h3>
        <div className="flex space-x-2 mb-2">
          <Badge>{currentTheme.id}</Badge>
          <Badge variant="outline">{currentTheme.name}</Badge>
          <Badge variant={currentTheme.is_default ? "default" : "secondary"}>
            {currentTheme.is_default ? "Default" : "Custom"}
          </Badge>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="design-tokens">
          <AccordionTrigger>Design Tokens</AccordionTrigger>
          <AccordionContent>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(currentTheme.design_tokens, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="component-tokens">
          <AccordionTrigger>Component Tokens ({currentTheme.component_tokens?.length || 0})</AccordionTrigger>
          <AccordionContent>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(currentTheme.component_tokens, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="admin-components">
          <AccordionTrigger>Admin Components ({adminComponents?.length || 0})</AccordionTrigger>
          <AccordionContent>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(adminComponents, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => console.log(currentTheme)}>
          Log Theme
        </Button>
      </div>
    </div>
  );
}

export default ThemeDebugger;
