
import React, { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { Theme } from '@/types/theme';

export function ThemeSettings() {
  const { currentTheme, isLoading, error, setTheme, updateCurrentTheme } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeSettings', { category: LogCategory.THEME });

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error loading themes',
        description: error.message || 'An unexpected error occurred',
      });
    }
  }, [error, toast]);

  const handleThemeChange = async (themeId: string) => {
    try {
      await setTheme(themeId);
      toast({
        title: 'Theme Updated',
        description: 'Your theme has been updated successfully',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to update theme',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
    }
  };

  const handleSaveTheme = async () => {
    // Implement your save logic here
    logger.debug('Saving theme changes', { details: { themeId: currentTheme?.id } });
    toast({
      title: 'Theme Saved',
      description: 'Your theme changes have been saved',
    });
  };

  // Get all available themes from the store
  const availableThemes = currentTheme ? [currentTheme] : [];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Theme Settings</h1>
      
      {/* Theme selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Theme</CardTitle>
          <CardDescription>Choose from available themes or customize the current one</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="theme-select">Theme</Label>
              <Select
                value={currentTheme?.id}
                onValueChange={handleThemeChange}
                disabled={isLoading}
              >
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {availableThemes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.name} {theme.is_default && "(Default)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Basic theme settings if a theme is selected */}
      {currentTheme && (
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic theme configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="theme-name">Theme Name</Label>
                  <Input 
                    id="theme-name" 
                    value={currentTheme.name} 
                    onChange={(e) => 
                      updateCurrentTheme({ name: e.target.value })
                    } 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="dark-mode"
                    checked={currentTheme.context === 'dark'} 
                    onCheckedChange={(checked) => 
                      updateCurrentTheme({ 
                        context: checked ? 'dark' : 'light' 
                      })
                    }
                  />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveTheme}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Colors Tab */}
          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
                <CardDescription>Customize the color scheme</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="primary-color"
                      type="color"
                      value={currentTheme.design_tokens?.colors?.primary || '#000000'}
                      className="w-16 h-10"
                      onChange={(e) => 
                        updateCurrentTheme({
                          design_tokens: {
                            ...currentTheme.design_tokens,
                            colors: {
                              ...currentTheme.design_tokens?.colors,
                              primary: e.target.value
                            }
                          }
                        })
                      }
                    />
                    <Input 
                      value={currentTheme.design_tokens?.colors?.primary || '#000000'}
                      onChange={(e) => 
                        updateCurrentTheme({
                          design_tokens: {
                            ...currentTheme.design_tokens,
                            colors: {
                              ...currentTheme.design_tokens?.colors,
                              primary: e.target.value
                            }
                          }
                        })
                      }
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="secondary-color"
                      type="color"
                      value={currentTheme.design_tokens?.colors?.secondary || '#000000'}
                      className="w-16 h-10"
                      onChange={(e) => 
                        updateCurrentTheme({
                          design_tokens: {
                            ...currentTheme.design_tokens,
                            colors: {
                              ...currentTheme.design_tokens?.colors,
                              secondary: e.target.value
                            }
                          }
                        })
                      }
                    />
                    <Input 
                      value={currentTheme.design_tokens?.colors?.secondary || '#000000'}
                      onChange={(e) => 
                        updateCurrentTheme({
                          design_tokens: {
                            ...currentTheme.design_tokens,
                            colors: {
                              ...currentTheme.design_tokens?.colors,
                              secondary: e.target.value
                            }
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveTheme}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Expert theme configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="theme-css">Custom CSS</Label>
                    <textarea
                      id="theme-css"
                      className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                      placeholder=":root { --custom-variable: value; }"
                      value=""
                      onChange={(e) => {
                        // Just update UI state for now, custom CSS not implemented in Theme type
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveTheme}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default ThemeSettings;
