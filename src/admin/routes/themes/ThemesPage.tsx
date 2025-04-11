
import React from "react";
import { Card } from '@/ui/core/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';
import { Shield, Paintbrush, Palette } from "lucide-react";

export default function ThemesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Theme Management</h1>
      </div>
      
      <Tabs defaultValue="system">
        <TabsList className="mb-4">
          <TabsTrigger value="system">System Themes</TabsTrigger>
          <TabsTrigger value="custom">Custom Themes</TabsTrigger>
          <TabsTrigger value="editor">Theme Editor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Paintbrush className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">System Themes</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Manage the default system themes available to all users.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Cyberpunk', 'Minimal', 'Classic', 'Dark Matter', 'Neon'].map((theme) => (
                <div 
                  key={theme}
                  className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-medium text-primary">{theme}</h3>
                  <p className="text-sm text-muted-foreground">System theme</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Custom Themes</h2>
            </div>
            <p className="text-muted-foreground">
              Create and manage custom themes for the platform.
            </p>
            <div className="flex items-center justify-center h-40 border border-dashed border-border rounded-lg mt-4">
              <p className="text-muted-foreground">Custom theme editor is coming soon</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="editor">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Theme Editor</h2>
            </div>
            <p className="text-muted-foreground">
              Create and customize themes with the visual editor.
            </p>
            <div className="flex items-center justify-center h-40 border border-dashed border-border rounded-lg mt-4">
              <p className="text-muted-foreground">Visual theme editor is coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
