
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
  const [localIsLoading, setLocalIsLoading] = useState(false);
  
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
        setLocalIsLoading(true);
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
      } finally {
        setLocalIsLoading(false);
      }
    };
    
    loadThemeData();
  }, [hydrateTheme, loadComponentsByContext, logger, toast]);

  // Reset theme to default
  const handleResetTheme = async () => {
    try {
      setLocalIsLoading(true);
      logger.info('Resetting theme to default');
      
      // Fixed: Don't pass themeId parameter to resetToDefault
      await loadSiteComponents();
      
      toast({
        title: 'Theme Reset',
        description: 'Theme reset to default',
        variant: 'default'
      });
    } catch (err) {
      logger.error('Failed to reset theme', { details: err });
      toast({
        title: 'Theme Reset Error',
        description: 'Failed to reset theme to default',
        variant: 'destructive'
      });
    } finally {
      setLocalIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Theme Settings</h1>
      <div className="space-y-8">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Theme Management</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Current Theme</h3>
                <p className="text-sm text-muted-foreground">
                  {currentTheme?.name || 'Default Theme'}
                </p>
              </div>
              
              <Button 
                onClick={handleResetTheme}
                disabled={localIsLoading || isLoading}
              >
                Reset to Default
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
