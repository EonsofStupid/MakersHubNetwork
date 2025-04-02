
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Paintbrush, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeVisualEditor } from "@/admin/components/theme/ThemeVisualEditor";
import { useNavigate } from "react-router-dom";
import { DEFAULT_THEME_NAME } from "@/utils/themeInitializer";

export default function ThemesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-primary w-5 h-5" />
          <h1 className="text-2xl font-bold">Theme Management</h1>
        </div>
        
        <Button 
          variant="default" 
          size="sm"
          onClick={() => navigate("/admin/themes/editor")}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Visual Editor
        </Button>
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
              <div 
                className="border border-primary/50 rounded-lg p-4 hover:border-primary/70 transition-colors bg-card/50"
              >
                <h3 className="font-medium text-primary">{DEFAULT_THEME_NAME}</h3>
                <p className="text-sm text-muted-foreground">Default system theme</p>
              </div>
              
              {['Cyberpunk', 'Minimal', 'Dark Matter', 'Neon'].map((theme) => (
                <div 
                  key={theme}
                  className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-medium">{theme}</h3>
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
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Create your first custom theme</p>
                <Button variant="outline" size="sm">
                  <Palette className="w-4 h-4 mr-2" />
                  Create Theme
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="editor">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Theme Editor</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Customize the default {DEFAULT_THEME_NAME} theme with the theme editor.
            </p>
            
            <ThemeVisualEditor />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
