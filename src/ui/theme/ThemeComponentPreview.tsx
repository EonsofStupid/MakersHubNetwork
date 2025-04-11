
import React from 'react';
import { Card } from '@/ui/core/card';
import { ThemeToken } from '@/types/theme';

export interface ThemeComponentPreviewProps {
  component: string;
  componentTokens: ThemeToken[];
}

export function ThemeComponentPreview({ component, componentTokens }: ThemeComponentPreviewProps) {
  const renderPreview = () => {
    switch (component.toLowerCase()) {
      case 'button':
        return (
          <div className="grid grid-cols-3 gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Primary</button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md">Secondary</button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-md">Tertiary</button>
          </div>
        );
      case 'card':
        return (
          <Card className="p-4 w-full">
            <div className="space-y-2">
              <h3 className="font-medium">Card Title</h3>
              <p className="text-sm text-muted-foreground">Card Description</p>
              <div className="h-20 rounded-md bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Card Content</span>
              </div>
            </div>
          </Card>
        );
      case 'input':
        return (
          <input 
            type="text" 
            placeholder="Input example" 
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      default:
        return (
          <div className="p-4 text-center bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">No preview for {component}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{component}</h3>
      <div className="rounded-md border p-4">
        {renderPreview()}
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Component Tokens</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {componentTokens.length > 0 ? (
            componentTokens.map(token => (
              <div key={token.id} className="flex justify-between">
                <span>{token.token_name}</span>
                <code className="bg-muted px-1 rounded text-xs">{token.token_value}</code>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No specific tokens for this component</p>
          )}
        </div>
      </div>
    </div>
  );
}
