import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Paintbrush, Save, Undo, Copy, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/constants/log-level';
import { safeDetails } from '@/logging/utils/safeDetails';
import { ColorPicker } from './ColorPicker';
import { Theme } from '@/types/theme';
import { transformThemeModel, prepareThemeForDatabase } from '@/utils/transformUtils';

interface ThemeEditorProps {
  themeId?: string;
}

export function ThemeEditor({ themeId }: ThemeEditorProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');
  const { toast } = useToast();
  const { user } = useAuth();
  const logger = useLogger('ThemeEditor', { category: LogCategory.THEME });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsLoading(true);
        logger.info('Loading theme data', { details: { themeId } });
        
        let query = supabase.from('themes')
          .select('*');
        
        if (themeId) {
          query = query.eq('id', themeId);
        } else {
          query = query.eq('is_default', true);
        }
        
        const { data, error } = await query.limit(1).single();
        
        if (error) throw error;
        
        if (!data) {
          logger.warn('No theme data found');
          return;
        }
        
        const transformedTheme = transformThemeModel(data);
        if (!transformedTheme) {
          throw new Error('Failed to transform theme data');
        }
        
        setTheme(transformedTheme);
        logger.info('Theme data loaded successfully');
      } catch (err) {
        logger.error('Failed to load theme data', { details: safeDetails(err) });
        toast({
          title: 'Error loading theme',
          description: 'Could not load theme data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, [themeId, toast, logger]);

  const handleColorChange = (path: string, color: string) => {
    if (!theme) return;
    
    setTheme(prevTheme => {
      if (!prevTheme) return null;
      
      const updatedTokens = { ...prevTheme.design_tokens };
      
      const parts = path.split('.');
      let current: any = updatedTokens;
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      current[parts[parts.length - 1]] = color;
      
      return {
        ...prevTheme,
        design_tokens: updatedTokens
      };
    });
  };

  const saveTheme = async () => {
    if (!theme || !user?.id) return;
    
    try {
      setIsSaving(true);
      logger.info('Saving theme changes');
      
      const dbTheme = prepareThemeForDatabase(theme);
      
      const { error } = await supabase
        .from('themes')
        .update({
          design_tokens: dbTheme.design_tokens,
          updated_at: new Date().toISOString(),
          version: (theme.version || 0) + 1
        })
        .eq('id', theme.id);
      
      if (error) throw error;
      
      toast({
        title: 'Theme saved',
        description: 'Theme changes have been saved successfully'
      });
      
      logger.info('Theme saved successfully');
    } catch (err) {
      logger.error('Failed to save theme', { details: safeDetails(err) });
      toast({
        title: 'Error saving theme',
        description: 'Could not save theme changes',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const createPreview = () => {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) return;
    
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Theme Preview</title>
          <style>
            :root {
              --primary: ${theme?.design_tokens?.colors?.primary || '#00F0FF'};
              --secondary: ${theme?.design_tokens?.colors?.secondary || '#FF2D6E'};
              --background: ${theme?.design_tokens?.colors?.background?.main || '#12121A'};
              --foreground: ${theme?.design_tokens?.colors?.text?.primary || '#F6F6F7'};
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background-color: var(--background);
              color: var(--foreground);
              padding: 2rem;
              margin: 0;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            .card {
              background-color: rgba(255, 255, 255, 0.05);
              border-radius: 8px;
              padding: 1.5rem;
              margin-bottom: 1.5rem;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            h1 {
              color: var(--primary);
              margin-top: 0;
            }
            button {
              background-color: var(--primary);
              color: var(--background);
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
            }
            .secondary {
              background-color: var(--secondary);
            }
            .element {
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Theme Preview</h1>
            <div class="card">
              <h2>Elements</h2>
              <div class="element">
                <button>Primary Button</button>
                <button class="secondary">Secondary Button</button>
              </div>
              <div class="element">
                <p>This is a paragraph with <a href="#" style="color: var(--primary);">a link</a> styled with your theme colors.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    previewWindow.document.close();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>Loading theme data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!theme) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>No theme found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-primary" />
          <CardTitle>Theme Editor</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={createPreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={saveTheme}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="theme-name">Theme Name</Label>
              <Input 
                id="theme-name" 
                value={theme.name || ''}
                readOnly
                className="bg-muted/50"
              />
            </div>
            <div>
              <Label htmlFor="theme-status">Status</Label>
              <Input 
                id="theme-status" 
                value={theme.status || 'draft'}
                readOnly
                className="bg-muted/50"
              />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Primary Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <ColorPicker 
                label="Primary" 
                color={theme.design_tokens?.colors?.primary || '#00F0FF'}
                onChange={(color) => handleColorChange('colors.primary', color)}
              />
              <ColorPicker 
                label="Secondary" 
                color={theme.design_tokens?.colors?.secondary || '#FF2D6E'}
                onChange={(color) => handleColorChange('colors.secondary', color)}
              />
              <ColorPicker 
                label="Accent" 
                color={theme.design_tokens?.colors?.accent || '#8B5CF6'}
                onChange={(color) => handleColorChange('colors.accent', color)}
              />
            </div>
            
            <h3 className="text-lg font-medium mb-2">Background Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <ColorPicker 
                label="Background" 
                color={theme.design_tokens?.colors?.background?.main || '#12121A'}
                onChange={(color) => handleColorChange('colors.background.main', color)}
              />
              <ColorPicker 
                label="Card Background" 
                color={theme.design_tokens?.colors?.background?.card || '#1E1E1E'}
                onChange={(color) => handleColorChange('colors.background.card', color)}
              />
              <ColorPicker 
                label="Alt Background" 
                color={theme.design_tokens?.colors?.background?.alt || '#2D2D2D'}
                onChange={(color) => handleColorChange('colors.background.alt', color)}
              />
            </div>
            
            <h3 className="text-lg font-medium mb-2">Text Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <ColorPicker 
                label="Text Primary" 
                color={theme.design_tokens?.colors?.text?.primary || '#FFFFFF'}
                onChange={(color) => handleColorChange('colors.text.primary', color)}
              />
              <ColorPicker 
                label="Text Secondary" 
                color={theme.design_tokens?.colors?.text?.secondary || 'rgba(255,255,255,0.7)'}
                onChange={(color) => handleColorChange('colors.text.secondary', color)}
              />
              <ColorPicker 
                label="Text Muted" 
                color={theme.design_tokens?.colors?.text?.muted || 'rgba(255,255,255,0.5)'}
                onChange={(color) => handleColorChange('colors.text.muted', color)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="typography">
            <h3 className="text-lg font-medium mb-2">Font Families</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="font-body">Body Font</Label>
                <Input 
                  id="font-body" 
                  value={theme.design_tokens?.typography?.fonts?.body || 'system-ui, sans-serif'}
                  onChange={(e) => handleColorChange('typography.fonts.body', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="font-heading">Heading Font</Label>
                <Input 
                  id="font-heading" 
                  value={theme.design_tokens?.typography?.fonts?.heading || 'system-ui, sans-serif'}
                  onChange={(e) => handleColorChange('typography.fonts.heading', e.target.value)}
                />
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-2">Font Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="size-sm">Small</Label>
                <Input 
                  id="size-sm" 
                  value={theme.design_tokens?.typography?.sizes?.sm || '0.875rem'}
                  onChange={(e) => handleColorChange('typography.sizes.sm', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="size-base">Medium</Label>
                <Input 
                  id="size-base" 
                  value={theme.design_tokens?.typography?.sizes?.base || '1rem'}
                  onChange={(e) => handleColorChange('typography.sizes.base', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="size-lg">Large</Label>
                <Input 
                  id="size-lg" 
                  value={theme.design_tokens?.typography?.sizes?.lg || '1.125rem'}
                  onChange={(e) => handleColorChange('typography.sizes.lg', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="components">
            <h3 className="text-lg font-medium mb-2">Component Styling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="panel-radius">Panel Border Radius</Label>
                <Input 
                  id="panel-radius" 
                  value={theme.design_tokens?.components?.panel?.radius || '0.75rem'}
                  onChange={(e) => handleColorChange('components.panel.radius', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="button-radius">Button Border Radius</Label>
                <Input 
                  id="button-radius" 
                  value={theme.design_tokens?.components?.button?.radius || '0.5rem'}
                  onChange={(e) => handleColorChange('components.button.radius', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="effects">
            <h3 className="text-lg font-medium mb-2">Effects and Animations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="glow-primary">Primary Glow Effect</Label>
                <Input 
                  id="glow-primary" 
                  value={theme.design_tokens?.effects?.glow?.primary || '0 0 10px rgba(0,240,255,0.7)'}
                  onChange={(e) => handleColorChange('effects.glow.primary', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="glow-secondary">Secondary Glow Effect</Label>
                <Input 
                  id="glow-secondary" 
                  value={theme.design_tokens?.effects?.glow?.secondary || '0 0 10px rgba(255,45,110,0.7)'}
                  onChange={(e) => handleColorChange('effects.glow.secondary', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
