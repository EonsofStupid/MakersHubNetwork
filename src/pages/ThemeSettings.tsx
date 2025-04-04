// Import necessary components
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/theme/store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { useToast } from '@/hooks/use-toast';

export default function ThemeSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const {
    currentTheme,
    themeTokens,
    themeComponents,
    isLoading,
    error,
    setTheme,
    loadComponentsByContext,
    hydrateTheme,
    loadSiteComponents
  } = useThemeStore();
  
  const logger = useLogger('ThemeSettings', { category: LogCategory.THEME });

  // Load theme data
  useEffect(() => {
    const loadThemeData = async () => {
      try {
        logger.info('Loading theme data');
        
        if (!currentTheme) {
          await hydrateTheme();
        }
        
        await loadComponentsByContext();
        
        setIsLoaded(true);
        logger.info('Theme data loaded successfully');
      } catch (err) {
        logger.error('Failed to load theme data', { details: err });
        toast({
          title: 'Theme Load Error',
          description: 'Failed to load theme settings',
          variant: 'destructive'
        });
      }
    };
    
    loadThemeData();
  }, [hydrateTheme, loadComponentsByContext, currentTheme, logger, toast]);

  if (isLoading || !isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Theme Settings</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2 text-destructive">Error Loading Theme</h2>
          <p className="mb-4 text-muted-foreground">{error.message}</p>
          <Button onClick={() => hydrateTheme()}>Retry</Button>
        </div>
      </div>
    );
  }

  /**
   * Select theme handler
   */
  const handleSelectTheme = async (themeId: string) => {
    try {
      setIsLoading(true);
      logger.info(`Selecting theme: ${themeId}`);
      
      // Fix: Pass required argument to loadSiteComponents
      await loadSiteComponents(themeId);
      
      logger.info('Theme components loaded successfully');
      toast({
        title: 'Theme Updated',
        description: 'Your theme has been updated successfully',
      });
    } catch (error) {
      logger.error('Error loading theme components', { details: error });
      toast({
        title: 'Theme Update Failed',
        description: 'There was an error updating your theme',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/settings')}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Theme Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 space-y-6">
          <div className="bg-card rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Current Theme</h2>
            {currentTheme ? (
              <div>
                <p className="text-lg font-medium">{currentTheme.name}</p>
                <p className="text-muted-foreground text-sm">{currentTheme.description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Status: <span className="capitalize">{currentTheme.status}</span>
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No theme selected</p>
            )}
          </div>
          
          {/* Theme selector will go here */}
        </div>
        
        <div className="md:col-span-9 space-y-6">
          <div className="bg-card rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Theme Preview</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch name="Primary" value={currentTheme?.design_tokens?.colors?.primary} />
                <ColorSwatch name="Secondary" value={currentTheme?.design_tokens?.colors?.secondary} />
                <ColorSwatch name="Accent" value={currentTheme?.design_tokens?.colors?.accent} />
                <ColorSwatch name="Background" value={currentTheme?.design_tokens?.colors?.background?.main} />
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-2">Typography</h3>
                <div className="space-y-2">
                  <p className="text-3xl">Heading Example</p>
                  <p className="text-base">Regular text example</p>
                  <p className="text-sm">Small text example</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-2">Components</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Theme Components</h2>
            <p className="text-muted-foreground mb-4">
              {themeComponents.length} components loaded ({themeComponents.filter(c => c.context === 'site').length} site, {themeComponents.filter(c => c.context === 'admin').length} admin)
            </p>
            
            <div className="overflow-auto max-h-[300px] border rounded-md">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 text-sm font-medium">Name</th>
                    <th className="text-left p-2 text-sm font-medium">Context</th>
                    <th className="text-left p-2 text-sm font-medium">Properties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {themeComponents.slice(0, 10).map((comp) => (
                    <tr key={comp.id}>
                      <td className="p-2">{comp.component_name}</td>
                      <td className="p-2">{comp.context}</td>
                      <td className="p-2 text-xs">{Object.keys(comp.styles).length} props</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ name, value }: { name: string; value?: string }) {
  return (
    <div>
      <div 
        className="h-12 rounded-md border border-border mb-1"
        style={{ backgroundColor: value || 'transparent' }}
      ></div>
      <div className="flex justify-between items-center">
        <span className="text-sm">{name}</span>
        <span className="text-xs text-muted-foreground">{value || 'Not set'}</span>
      </div>
    </div>
  );
}

// ArrowLeftIcon component
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7"/>
      <path d="M19 12H5"/>
    </svg>
  );
}
