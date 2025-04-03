
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Palette, Check, RotateCcw } from "lucide-react";
import { useImpulsivityStore } from '@/admin/store/impulse.store';
import { flattenTheme, getReadableLabel } from '@/admin/theme/utils/themeUtils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAllThemes } from '@/admin/theme/registry';

export function ThemeVisualEditor() {
  const { theme, setTheme, saveTheme, resetTheme, isDirty, isLoading } = useImpulsivityStore();
  const [activeTab, setActiveTab] = useState("colors");
  const [searchTerm, setSearchTerm] = useState("");
  const availableThemes = getAllThemes();
  const { toast } = useToast();
  
  // Filter theme properties based on search term and active tab
  const filteredProperties = flattenTheme(theme)
    .filter(prop => {
      const matchesSearch = searchTerm === "" || 
        prop.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(prop.value).toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesTab = activeTab === "all" || prop.path.startsWith(activeTab);
      
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => a.path.localeCompare(b.path));
  
  // Handle property value change
  const handlePropertyChange = (path: string, value: any) => {
    // Update the specific property
    setTheme({ [path]: value } as any);
  };
  
  // Handle the save action
  const handleSave = async () => {
    try {
      await saveTheme();
      toast({
        title: "Theme saved",
        description: "Your theme changes have been saved successfully.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error saving theme",
        description: "There was an error saving your theme changes.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  // Handle reset to defaults
  const handleReset = () => {
    resetTheme();
    toast({
      title: "Theme reset",
      description: "Theme has been reset to default values.",
      duration: 3000,
    });
  };
  
  // Load theme on component mount
  useEffect(() => {
    async function loadThemeData() {
      try {
        await useImpulsivityStore.getState().loadTheme();
      } catch (error) {
        toast({
          title: "Error loading theme",
          description: "There was an error loading the theme data.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
    
    loadThemeData();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Palette className="text-primary w-5 h-5" />
          <h2 className="text-xl font-semibold">Impulsivity Theme Editor</h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isLoading}
          >
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Theme Properties</CardTitle>
              <div className="flex items-center">
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="colors" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="effects">Effects</TabsTrigger>
                  <TabsTrigger value="animation">Animation</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="space-y-4">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map(({ path, value, type }) => (
                      <div key={path} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-border/50 last:border-0">
                        <div className="col-span-5 lg:col-span-4">
                          <Label htmlFor={path}>{getReadableLabel(path)}</Label>
                          <div className="text-xs text-muted-foreground mt-1">{path}</div>
                        </div>
                        
                        <div className="col-span-7 lg:col-span-8">
                          {type === 'color' ? (
                            <div className="flex gap-2 items-center">
                              <div 
                                className="w-6 h-6 rounded-full border border-border shadow-sm"
                                style={{ backgroundColor: value }}
                              />
                              <Input
                                id={path}
                                type="text"
                                value={value}
                                onChange={(e) => handlePropertyChange(path, e.target.value)}
                              />
                            </div>
                          ) : type === 'number' ? (
                            <Input
                              id={path}
                              type="number"
                              value={value}
                              onChange={(e) => handlePropertyChange(path, parseFloat(e.target.value))}
                            />
                          ) : (
                            <Input
                              id={path}
                              type="text"
                              value={value}
                              onChange={(e) => handlePropertyChange(path, e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No properties found matching your filters.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preview</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div 
                className="rounded-lg p-4 border border-border/50"
                style={{ 
                  backgroundColor: theme.colors.background?.main || '#12121A', 
                  color: theme.colors.text?.primary || '#F6F6F7' 
                }}
              >
                <h3 
                  className="mb-2"
                  style={{ color: theme.colors.text?.accent || '#00F0FF' }}
                >Preview Panel</h3>
                
                <p 
                  className="text-sm mb-4"
                  style={{ color: theme.colors.text?.secondary || 'rgba(255, 255, 255, 0.7)' }}
                >
                  This shows how your theme will look in the admin interface.
                </p>
                
                <div 
                  className="p-3 rounded-md mb-4"
                  style={{ 
                    backgroundColor: theme.colors.background?.card || 'rgba(28, 32, 42, 0.7)',
                    border: `1px solid ${theme.colors.borders?.normal || 'rgba(0, 240, 255, 0.2)'}`,
                    boxShadow: theme.effects?.glow?.primary || '0 0 15px rgba(0, 240, 255, 0.7)'
                  }}
                >
                  <p className="text-sm">Card with glow effect</p>
                </div>
                
                <button 
                  className="px-3 py-1.5 rounded-md text-sm transition-all duration-300"
                  style={{ 
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.colors.primary || '#00F0FF'}`,
                    color: theme.colors.primary || '#00F0FF'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.colors.primary || '#00F0FF'}20`;
                    e.currentTarget.style.boxShadow = theme.effects?.glow?.hover || '0 0 20px rgba(0, 240, 255, 0.9)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Primary Button
                </button>
                
                <button 
                  className="px-3 py-1.5 rounded-md text-sm ml-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.colors.secondary || '#FF2D6E'}`,
                    color: theme.colors.secondary || '#FF2D6E'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.colors.secondary || '#FF2D6E'}20`;
                    e.currentTarget.style.boxShadow = theme.effects?.glow?.secondary || '0 0 15px rgba(255, 45, 110, 0.7)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Secondary Button
                </button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Available Themes</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {availableThemes.map((preset) => (
                    <button
                      key={preset.id}
                      className="text-left p-2 rounded-md border border-border/50 hover:border-primary/50 transition-colors"
                      onClick={() => {
                        setTheme(preset.theme);
                        toast({
                          title: `${preset.name} Applied`,
                          description: "Theme changes are not saved yet.",
                          duration: 3000,
                        });
                      }}
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-muted-foreground">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
