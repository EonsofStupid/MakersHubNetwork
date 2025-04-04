
import { useState, useEffect } from 'react';
import { defaultImpulseTokens, ImpulseTheme } from '@/admin/types/impulse.types';
import { createThemeFromRecord, defaultImpulseTheme } from './utils/modelTransformers';
import { ThemeLoaderOptions } from './types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/constants/logLevel';

const logger = getLogger('ThemeLoader', { category: LogCategory.THEME });

export function useThemeLoader(options: ThemeLoaderOptions) {
  const [theme, setTheme] = useState<ImpulseTheme>(defaultImpulseTokens);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use the defaultImpulseTokens as the initial theme
        let loadedTheme: ImpulseTheme = defaultImpulseTokens;

        // Additional theme loading logic can be added here
        // For now, we're using the default theme
        
        setTheme(loadedTheme);
        logger.info('Theme loaded successfully', { details: { themeName: loadedTheme.name } });
      } catch (e) {
        const err = e instanceof Error ? e : new Error('Failed to load theme');
        logger.error('Error loading theme', { details: { error: err } });
        setError(err);
        // Use default theme as fallback
        setTheme(defaultImpulseTokens);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [options.defaultTheme]);

  return { theme, setTheme, isLoading, error };
}
