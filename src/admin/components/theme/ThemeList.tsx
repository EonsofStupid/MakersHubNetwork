import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SheetTrigger, Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Paintbrush, Copy, Trash, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { ThemeEditor } from './ThemeEditor';
import { Theme } from '@/types/theme';
import { transformThemeModel, prepareThemeForDatabase } from '@/utils/transformUtils';

export function ThemeList() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTheme, setNewTheme] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const { user } = useAuth();
  const logger = useLogger('ThemeList', LogCategory.THEME);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setIsLoading(true);
        logger.info('Fetching themes');
        
        const { data, error } = await supabase
          .from('themes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const transformedThemes = (data || [])
          .map(transformThemeModel)
          .filter((theme): theme is Theme => theme !== null);
        
        setThemes(transformedThemes);
        logger.info('Themes fetched successfully', { details: { count: transformedThemes.length } });
      } catch (err) {
        logger.error('Error fetching themes', { details: safeDetails(err) });
        toast({
          title: 'Error fetching themes',
          description: 'Could not load themes',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThemes();
  }, [toast, logger]);

  const createTheme = async () => {
    if (!newTheme.name.trim()) {
      toast({
        title: 'Invalid name',
        description: 'Please provide a name for the theme',
        variant: 'destructive'
      });
      return;
    }
    
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create a theme',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsCreating(true);
      logger.info('Creating new theme', { details: { name: newTheme.name } });
      
      const { data: defaultTheme, error: defaultError } = await supabase
        .from('themes')
        .select('design_tokens, component_tokens')
        .eq('is_default', true)
        .limit(1)
        .single();
      
      if (defaultError && defaultError.code !== 'PGRST116') {
        throw defaultError;
      }
      
      const design_tokens = defaultTheme?.design_tokens || {
        colors: {
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          accent: '#8B5CF6',
          background: {
            main: '#12121A',
            overlay: 'rgba(0,0,0,0.7)',
            card: '#1E1E1E',
            alt: '#2D2D2D'
          },
          text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255,255,255,0.7)',
            accent: '#00F0FF',
            muted: 'rgba(255,255,255,0.5)'
          },
        }
      };

      const component_tokens = Array.isArray(defaultTheme?.component_tokens) 
        ? defaultTheme.component_tokens
        : [];
      
      const { data, error } = await supabase
        .from('themes')
        .insert({
          name: newTheme.name,
          description: newTheme.description,
          design_tokens,
          component_tokens,
          created_by: user.id,
          status: 'draft'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newThemeModel = transformThemeModel(data);
      
      if (newThemeModel) {
        setThemes(prevThemes => [newThemeModel, ...prevThemes]);
      }
      
      setNewTheme({ name: '', description: '' });
      
      toast({
        title: 'Theme created',
        description: 'New theme has been created successfully'
      });
      
      logger.info('Theme created successfully', { details: { id: data.id } });
    } catch (err) {
      logger.error('Error creating theme', { details: safeDetails(err) });
      toast({
        title: 'Error creating theme',
        description: 'Could not create theme',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const duplicateTheme = async (themeId: string) => {
    if (!user?.id) return;
    
    try {
      logger.info('Duplicating theme', { details: { themeId } });
      
      const { data: sourceTheme, error: sourceError } = await supabase
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();
      
      if (sourceError) throw sourceError;
      
      if (!sourceTheme) {
        throw new Error('Theme not found');
      }
      
      const themeModel = transformThemeModel(sourceTheme);
      
      if (!themeModel) {
        throw new Error('Failed to transform theme data');
      }
      
      const themeForDb = prepareThemeForDatabase({
        ...themeModel,
        name: `${themeModel.name} (Copy)`,
        created_by: user.id,
        status: 'draft',
        parent_theme_id: themeId,
        id: '' // Will be generated by the database
      });
      
      const { data, error } = await supabase
        .from('themes')
        .insert(themeForDb)
        .select()
        .single();
      
      if (error) throw error;
      
      const newThemeModel = transformThemeModel(data);
      
      if (newThemeModel) {
        setThemes(prevThemes => [newThemeModel, ...prevThemes]);
      }
      
      toast({
        title: 'Theme duplicated',
        description: 'Theme has been duplicated successfully'
      });
      
      logger.info('Theme duplicated successfully', { 
        details: { sourceId: themeId, newId: data.id } 
      });
    } catch (err) {
      logger.error('Error duplicating theme', { details: safeDetails(err) });
      toast({
        title: 'Error duplicating theme',
        description: 'Could not duplicate theme',
        variant: 'destructive'
      });
    }
  };

  const deleteTheme = async (themeId: string) => {
    try {
      logger.info('Deleting theme', { details: { themeId } });
      
      const themeToDelete = themes.find(t => t.id === themeId);
      
      if (themeToDelete?.is_default) {
        toast({
          title: 'Cannot delete default theme',
          description: 'The default theme cannot be deleted',
          variant: 'destructive'
        });
        return;
      }
      
      const { error } = await supabase
        .from('themes')
        .delete()
        .eq('id', themeId);
      
      if (error) throw error;
      
      setThemes(prevThemes => prevThemes.filter(theme => theme.id !== themeId));
      
      toast({
        title: 'Theme deleted',
        description: 'Theme has been deleted successfully'
      });
      
      logger.info('Theme deleted successfully', { details: { themeId } });
    } catch (err) {
      logger.error('Error deleting theme', { details: safeDetails(err) });
      toast({
        title: 'Error deleting theme',
        description: 'Could not delete theme',
        variant: 'destructive'
      });
    }
  };

  const publishTheme = async (themeId: string) => {
    try {
      logger.info('Publishing theme', { details: { themeId } });
      
      const { error } = await supabase
        .from('themes')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', themeId);
      
      if (error) throw error;
      
      setThemes(prevThemes => prevThemes.map(theme => 
        theme.id === themeId ? { ...theme, status: 'published' as const } : theme
      ));
      
      toast({
        title: 'Theme published',
        description: 'Theme has been published successfully'
      });
      
      logger.info('Theme published successfully', { details: { themeId } });
    } catch (err) {
      logger.error('Error publishing theme', { details: safeDetails(err) });
      toast({
        title: 'Error publishing theme',
        description: 'Could not publish theme',
        variant: 'destructive'
      });
    }
  };

  const setAsDefault = async (themeId: string) => {
    try {
      logger.info('Setting theme as default', { details: { themeId } });
      
      const { error: updateError } = await supabase
        .from('themes')
        .update({ is_default: false })
        .eq('is_default', true);
      
      if (updateError) throw updateError;
      
      const { error } = await supabase
        .from('themes')
        .update({ is_default: true })
        .eq('id', themeId);
      
      if (error) throw error;
      
      setThemes(prevThemes => prevThemes.map(theme => ({
        ...theme,
        is_default: theme.id === themeId
      })));
      
      toast({
        title: 'Default theme updated',
        description: 'The default theme has been updated successfully'
      });
      
      logger.info('Theme set as default successfully', { details: { themeId } });
    } catch (err) {
      logger.error('Error setting theme as default', { details: safeDetails(err) });
      toast({
        title: 'Error updating default theme',
        description: 'Could not update the default theme',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p>Loading themes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Theme Management</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Theme
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Theme</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Theme Name</Label>
                <Input
                  id="name"
                  placeholder="Enter theme name"
                  value={newTheme.name}
                  onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter theme description"
                  value={newTheme.description}
                  onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={createTheme}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Theme"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card key={theme.id} className="relative overflow-hidden">
            {theme.is_default && (
              <div className="absolute top-0 right-0 bg-primary text-xs px-2 py-1 text-background font-semibold">
                Default
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{theme.name}</span>
                <Badge variant={theme.status === 'published' ? 'default' : 'outline'}>
                  {theme.status}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground truncate">
                {theme.description || 'No description'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                {theme.design_tokens?.colors?.primary && (
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: theme.design_tokens.colors.primary }}
                  />
                )}
                {theme.design_tokens?.colors?.secondary && (
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: theme.design_tokens.colors.secondary }}
                  />
                )}
                {theme.design_tokens?.colors?.accent && (
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: theme.design_tokens.colors.accent }}
                  />
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTheme(theme.id)}
                    >
                      <Paintbrush className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[90vw] sm:w-[540px] md:w-[600px] lg:w-[800px] overflow-y-auto">
                    <SheetHeader className="mb-5">
                      <SheetTitle>Edit Theme: {theme.name}</SheetTitle>
                    </SheetHeader>
                    <ThemeEditor themeId={selectedTheme || undefined} />
                  </SheetContent>
                </Sheet>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => duplicateTheme(theme.id)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                
                {!theme.is_default && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAsDefault(theme.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Set as Default
                  </Button>
                )}
                
                {theme.status !== 'published' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => publishTheme(theme.id)}
                  >
                    Publish
                  </Button>
                )}
                
                {!theme.is_default && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-center gap-2 text-destructive mb-2">
                          <AlertCircle className="h-5 w-5" />
                          <p className="font-semibold">Warning</p>
                        </div>
                        <p>Are you sure you want to delete this theme? This action cannot be undone.</p>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() => deleteTheme(theme.id)}
                        >
                          Delete Theme
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {themes.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground mb-4">No themes found</p>
              <Button onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="true"]')?.click()}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first theme
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
