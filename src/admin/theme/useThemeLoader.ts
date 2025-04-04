
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { formatLogDetails } from '@/logging/utils/details-formatter';
import { createThemeFromRecord, defaultImpulseTheme } from './utils/modelTransformers';
import { ImpulseTheme, ThemeRecord } from './types';

/**
 * Hook for loading themes from the database
 */
export function useThemeLoader(themeId?: string) {
  const [activeTheme, setActiveTheme] = useState<ImpulseTheme | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const logger = useLogger('ThemeLoader', { category: LogCategory.THEME });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        logger.info('Loading theme', { details: { themeId: themeId || 'default' } });
        
        // Use the default theme if no ID is provided
        if (!themeId) {
          logger.info('No theme ID provided, using default theme');
          setActiveTheme(defaultImpulseTheme);
          setIsLoaded(true);
          return;
        }
        
        // Query the database for the requested theme
        const { data, error } = await supabase
          .from('themes')
          .select('*')
          .eq('id', themeId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          logger.warn('Theme not found, using default', { details: { themeId } });
          setActiveTheme(defaultImpulseTheme);
          setIsLoaded(true);
          return;
        }
        
        // Process the database record into a theme object
        const themeRecord = data as ThemeRecord;
        
        // Safely access json properties
        const themeData = themeRecord.theme_data;
        let colors = null;
        let effects = null;
        let animation = null;
        let components = null;
        let typography = null;
        
        // Parse theme data from JSON structure if it exists
        if (themeData && typeof themeData === 'object') {
          colors = themeData.colors;
          effects = themeData.effects;
          animation = themeData.animation;
          components = themeData.components;
          typography = themeData.typography;
        }
        
        // Create the theme from the record
        const theme = createThemeFromRecord(
          themeRecord,
          colors,
          effects,
          animation,
          components,
          typography
        );
        
        logger.info('Theme loaded successfully', { 
          details: { 
            themeName: theme.name,
            themeId: theme.id
          } 
        });
        
        setActiveTheme(theme);
        setIsLoaded(true);
      } catch (err) {
        const error = err as Error;
        logger.error('Error loading theme', { 
          details: formatLogDetails(error)
        });
        setError(error);
        // Fall back to default theme
        setActiveTheme(defaultImpulseTheme);
        setIsLoaded(true);
      }
    };
    
    loadTheme();
  }, [themeId, logger]);
  
  return {
    activeTheme,
    isLoaded,
    error,
    setActiveTheme
  };
}
