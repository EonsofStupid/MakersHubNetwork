
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/core/tabs";
import { Button } from "@/ui/core/button";
import { Input } from "@/ui/core/input";
import { Switch } from "@/ui/core/switch";
import { Badge } from "@/ui/core/badge";
import { Label } from "@/ui/core/label";

export function ThemeComponentPreview() {
  const [switchValue, setSwitchValue] = useState(false);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="buttons">
        <TabsList>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="buttons" className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="inputs" className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" />
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                id="theme-switch" 
                checked={switchValue} 
                onCheckedChange={setSwitchValue} 
              />
              <Label htmlFor="theme-switch">Toggle theme</Label>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="badges" className="space-y-4 py-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
