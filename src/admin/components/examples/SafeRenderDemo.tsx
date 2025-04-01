
import React, { useState } from 'react';
import { SafeRender } from '@/shared/utils/render';
import { CyberCard } from '@/admin/components/ui/CyberCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Demo component showcasing the SafeRender component and renderUnknownAsNode utility
 */
export function SafeRenderDemo() {
  const [currentValue, setCurrentValue] = useState<unknown>("Example text");
  const [inputValue, setInputValue] = useState("Example text");
  const [valueType, setValueType] = useState<string>("string");
  
  const updateValueFromType = () => {
    let newValue: unknown;
    
    switch (valueType) {
      case "string":
        newValue = inputValue;
        break;
      case "number":
        newValue = parseFloat(inputValue);
        break;
      case "boolean":
        newValue = inputValue.toLowerCase() === "true";
        break;
      case "array":
        try {
          newValue = JSON.parse(inputValue);
        } catch (e) {
          newValue = [inputValue];
        }
        break;
      case "object":
        try {
          newValue = JSON.parse(inputValue);
        } catch (e) {
          newValue = { value: inputValue };
        }
        break;
      case "null":
        newValue = null;
        break;
      case "undefined":
        newValue = undefined;
        break;
      case "error":
        newValue = new Error(inputValue);
        break;
      default:
        newValue = inputValue;
    }
    
    setCurrentValue(newValue);
  };
  
  return (
    <CyberCard title="SafeRender Demo" className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value to render"
            className="flex-grow"
          />
          
          <select
            value={valueType}
            onChange={(e) => setValueType(e.target.value)}
            className="p-2 rounded-md border bg-background"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="array">Array</option>
            <option value="object">Object</option>
            <option value="null">Null</option>
            <option value="undefined">Undefined</option>
            <option value="error">Error</option>
          </select>
          
          <Button onClick={updateValueFromType}>
            Render
          </Button>
        </div>
        
        <Tabs defaultValue="component">
          <TabsList className="mb-4">
            <TabsTrigger value="component">Component</TabsTrigger>
            <TabsTrigger value="utility">Utility</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="component">
            <div className="p-4 border rounded-md bg-muted/20">
              <h3 className="text-sm font-medium mb-2">SafeRender Component:</h3>
              <div className="p-2 bg-background rounded">
                <SafeRender value={currentValue} />
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <pre>{'<SafeRender value={currentValue} />'}</pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="utility">
            <div className="p-4 border rounded-md bg-muted/20">
              <h3 className="text-sm font-medium mb-2">renderUnknownAsNode Result:</h3>
              <div className="p-2 bg-background rounded">
                {React.createElement(() => (
                  <>{SafeRender({ value: currentValue })}</>
                ))}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <pre>{'renderUnknownAsNode(currentValue)'}</pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="raw">
            <div className="p-4 border rounded-md bg-muted/20">
              <h3 className="text-sm font-medium mb-2">Raw Value:</h3>
              <div className="p-2 bg-background rounded overflow-x-auto">
                <pre className="text-xs">
                  {typeof currentValue === 'undefined' 
                    ? 'undefined' 
                    : JSON.stringify(currentValue, null, 2)}
                </pre>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Type: {typeof currentValue}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="text-sm text-muted-foreground border-t pt-4 mt-4">
          <p>This demo shows how the <code>SafeRender</code> component and <code>renderUnknownAsNode</code> utility 
          safely handle different types of values for rendering in React components.</p>
        </div>
      </div>
    </CyberCard>
  );
}
