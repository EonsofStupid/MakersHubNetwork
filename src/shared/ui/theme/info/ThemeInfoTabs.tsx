
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ThemeInfoTab } from './ThemeInfoTab';
import { Theme } from '@/shared/types/features/theme.types';
import { ThemeEffect } from '@/shared/types/theme/effects.types';

interface ThemeInfoTabsProps {
  theme: Theme;
}

export function ThemeInfoTabs({ theme }: ThemeInfoTabsProps) {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
        {theme.metadata?.effects && <TabsTrigger value="effects">Effects</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="info" className="p-2">
        <ThemeInfoTab theme={theme} />
      </TabsContent>
      
      <TabsContent value="tokens" className="p-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Design Tokens</h3>
          <div className="border rounded p-4 max-h-96 overflow-auto">
            <pre className="text-xs">
              {JSON.stringify(theme.designTokens, null, 2)}
            </pre>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="components" className="p-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Component Tokens</h3>
          {theme.componentTokens && Object.keys(theme.componentTokens).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(theme.componentTokens).map(([component, tokens]) => (
                <div key={component} className="border rounded p-4">
                  <h4 className="font-medium mb-2">{component}</h4>
                  <div className="text-sm space-y-1">
                    {Object.entries(tokens).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}:</span>
                        <span className="font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No component tokens defined</p>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="effects" className="p-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Theme Effects</h3>
          {theme.metadata?.effects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(theme.metadata.effects as ThemeEffect[]).map((effect, index) => (
                <div key={index} className="border rounded p-4">
                  <h4 className="font-medium mb-2">{effect.type}</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-mono">{effect.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intensity:</span>
                      <span className="font-mono">{effect.intensity}</span>
                    </div>
                    {effect.color && (
                      <div className="flex justify-between items-center">
                        <span>Color:</span>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: effect.color }} />
                          <span className="font-mono">{effect.color}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No effects defined</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
