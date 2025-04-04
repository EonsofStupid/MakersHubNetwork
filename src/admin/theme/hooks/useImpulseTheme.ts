
import { useState, useEffect } from 'react';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { themeRegistry } from '../ThemeRegistry';
import { defaultImpulseTokens } from '../impulse/tokens';
import { deepMerge } from '../utils/themeUtils';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function useImpulseTheme(themeId?: string) {
  const [theme, setTheme] = useState<ImpulseTheme>(defaultImpulseTokens);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const logger = useLogger('useImpulseTheme', { category: LogCategory.THEME });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsLoading(true);
        
        let loadedTheme: ImpulseTheme | null = null;
        
        // Try to load from registry first
        if (themeId) {
          loadedTheme = themeRegistry.getTheme(themeId);
          
          if (loadedTheme) {
            logger.debug(`Theme loaded from registry: ${themeId}`);
          }
        }
        
        // If no theme loaded, try active theme
        if (!loadedTheme) {
          loadedTheme = themeRegistry.getActiveTheme();
          
          if (loadedTheme) {
            logger.debug('Active theme loaded from registry');
          }
        }
        
        // If still no theme, use default
        if (!loadedTheme) {
          loadedTheme = defaultImpulseTokens;
          logger.debug('Using default theme as fallback');
        }
        
        // Ensure all required properties exist
        const completeTheme = deepMerge(defaultImpulseTokens, loadedTheme);
        setTheme(completeTheme);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error loading theme');
        logger.error('Failed to load theme', { details: { error: err.message } });
        setError(err);
        // Use default theme on error
        setTheme(defaultImpulseTokens);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, [themeId, logger]);
  
  return {
    theme,
    isLoading,
    error
  };
}
