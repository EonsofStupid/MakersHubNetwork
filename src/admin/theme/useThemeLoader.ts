
import { useEffect, useState } from 'react';
import { themeRegistry } from './ThemeRegistry';
import { ImpulseTheme } from '../types/impulse.types';
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';
import { useAuth } from '@/auth/hooks/useAuth';
import { applyThemeToDocument } from './utils/themeApplicator';
import { defaultImpulseTokens } from './impulse/tokens';

const logger = getLogger('ThemeLoader', LogCategory.THEME);

/**
 * Hook for loading and applying themes during application initialization
 */
export function useThemeLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    
    // Register the default theme immediately to avoid flash of unstyled content
    if (!themeRegistry.hasTheme('default')) {
      themeRegistry.registerTheme('default', defaultImpulseTokens);
      logger.debug('Default theme registered');
      
      // Apply default theme immediately
      applyThemeToDocument(defaultImpulseTokens);
    }
    
    const loadUserTheme = async () => {
      try {
        setIsLoading(true);
        
        // Query for the default theme or user preference
        const query = supabase
          .from('themes')
          .select('*')
          .eq('status', 'published')
          .eq('is_default', true)
          .limit(1);
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          logger.warn('No published themes found');
          if (isMounted) {
            setIsLoaded(true);
            setIsLoading(false);
          }
          return;
        }
        
        const theme = data[0];
        
        // Transform database theme to ImpulseTheme format
        try {
          // Extract relevant data to build a proper theme structure
          const impulseTheme: Partial<ImpulseTheme> = {
            id: theme.id,
            name: theme.name,
            version: theme.version?.toString() || '1.0.0',
            description: theme.description || '',
            // Map other theme properties as needed
            colors: theme.design_tokens?.colors || defaultImpulseTokens.colors,
            effects: theme.design_tokens?.effects || defaultImpulseTokens.effects,
            animation: theme.design_tokens?.animation || defaultImpulseTokens.animation,
            components: theme.design_tokens?.components || defaultImpulseTokens.components,
            typography: theme.design_tokens?.typography || defaultImpulseTokens.typography
          };
          
          // Register the theme in the registry
          themeRegistry.registerTheme(theme.id, impulseTheme as ImpulseTheme);
          
          // Apply the theme to the document
          applyThemeToDocument(impulseTheme as ImpulseTheme);
          
          if (isMounted) {
            setActiveThemeId(theme.id);
            logger.info('Theme loaded and applied successfully', { 
              details: { themeId: theme.id, themeName: theme.name } 
            });
          }
        } catch (parseError) {
          logger.error('Failed to parse theme data', { 
            details: safeDetails(parseError) 
          });
          
          // Fallback to default theme if parsing fails
          applyThemeToDocument(defaultImpulseTokens);
        }
        
        if (isMounted) {
          setIsLoaded(true);
          setIsLoading(false);
        }
      } catch (err) {
        logger.error('Error loading theme', { details: safeDetails(err) });
        
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error loading theme'));
          setIsLoading(false);
          setIsLoaded(true); // Still mark as loaded so app continues
        }
        
        // Ensure default theme is applied on error
        applyThemeToDocument(defaultImpulseTokens);
      }
    };
    
    loadUserTheme();
    
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return {
    isLoaded,
    isLoading,
    error,
    activeThemeId
  };
}
