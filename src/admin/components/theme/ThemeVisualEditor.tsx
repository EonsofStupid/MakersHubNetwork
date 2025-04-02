
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Palette, 
  Sliders, 
  Box, 
  Type, 
  Sparkles, 
  Save,
  RotateCcw
} from "lucide-react";
import { useImpulseTheme } from '@/admin/theme/hooks/useImpulseTheme';
import { DEFAULT_THEME_NAME } from '@/utils/themeInitializer';
import { 
  syncCSSToDatabase, 
  getReadableLabel 
} from '@/utils/themeUtils';

/**
 * Theme Visual Editor
 * A component for visually editing the Impulsivity theme
 */
export function ThemeVisualEditor() {
  const { 
    theme, 
    updateThemeValue, 
    resetTheme, 
    saveTheme, 
    isLoading, 
    isSaving, 
    isDirty 
  } = useImpulseTheme();
  const [syncingCSS, setSyncingCSS] = useState(false);
  
  // Handler for color input changes
  const handleColorChange = (path: string, value: string) => {
    updateThemeValue(path, value);
  };
  
  // Handle saving theme and syncing CSS
  const handleSaveAndSync = async () => {
    await saveTheme();
    setSyncingCSS(true);
    
    try {
      // For now, this is just a placeholder since we don't have the theme ID
      // In the future, this will be used to sync CSS to the database
      await syncCSSToDatabase('placeholder-id');
    } catch (error) {
      console.error('Error syncing CSS:', error);
    } finally {
      setSyncingCSS(false);
    }
  };
  
  // This is just a foundation for the visual editor
  // More functionality will be added in future implementations
  return (
    <Card className="shadow-md border-primary/20">
      <CardHeader className="border-b border-border/30">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            {DEFAULT_THEME_NAME} Theme Editor
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetTheme}
              disabled={isLoading || isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSaveAndSync}
              disabled={isLoading || isSaving || !isDirty}
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving || syncingCSS ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="colors">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="colors">
              <Palette className="h-4 w-4 mr-1" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="effects">
              <Sparkles className="h-4 w-4 mr-1" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="components">
              <Box className="h-4 w-4 mr-1" />
              Components
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-1" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="animation">
              <Sliders className="h-4 w-4 mr-1" />
              Animation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded-md border border-border" 
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <Input 
                    type="text" 
                    value={theme.colors.primary} 
                    onChange={(e) => handleColorChange('colors.primary', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded-md border border-border" 
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <Input 
                    type="text" 
                    value={theme.colors.secondary} 
                    onChange={(e) => handleColorChange('colors.secondary', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground pt-4">
              This is a foundation for the visual theme editor. More functionality will be implemented in future updates.
            </p>
          </TabsContent>
          
          <TabsContent value="effects">
            <p className="text-sm text-muted-foreground">
              Effects editing will be available in a future update.
            </p>
          </TabsContent>
          
          <TabsContent value="components">
            <p className="text-sm text-muted-foreground">
              Component style editing will be available in a future update.
            </p>
          </TabsContent>
          
          <TabsContent value="typography">
            <p className="text-sm text-muted-foreground">
              Typography editing will be available in a future update.
            </p>
          </TabsContent>
          
          <TabsContent value="animation">
            <p className="text-sm text-muted-foreground">
              Animation editing will be available in a future update.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
