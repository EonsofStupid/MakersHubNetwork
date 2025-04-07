
import { supabase } from '@/lib/supabase';
import { getLogger } from '@/logging';
import { Theme, ThemeContext } from '@/types/theme';
import { ThemeTokens, defaultTokens } from '@/theme/tokenSchema';
import defaultTheme from '@/theme/defaultTheme';
import { persistThemeTokens } from '@/lib/theme/safeStorage';
import { toBoolean, isBoolean } from '@/utils/typeGuards';

const logger = getLogger('ThemeLoader');

/**
 * Load theme tokens with fallback chain:
 * 1. From Supabase edge function
 * 2. From localStorage
 * 3. From static default theme
 */
export async function loadThemeTokens(context: ThemeContext = 'site'): Promise<ThemeTokens> {
  logger.info('Loading theme tokens', { 
    details: { context } 
  });
  
  try {
    // Try loading from Supabase with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Supabase timeout')), 3000);
    });
    
    // Try to get theme from Supabase edge function
    const themePromise = supabase.functions.invoke('theme-service', { 
      body: { context } 
    });
    
    const result = await Promise.race([themePromise, timeoutPromise]);
    
    if (!result) {
      throw new Error('No result from Supabase');
    }
    
    const functionResult = result as { data?: any, error?: any };
    if (functionResult.error) {
      throw new Error(`Supabase error: ${functionResult.error?.message || 'Unknown error'}`);
    }
    
    const data = functionResult.data;
    
    if (data?.tokens) {
      logger.info('Theme loaded from Supabase', { 
        details: { source: 'edge-function' }
      });
      
      // Persist for future offline use
      persistThemeTokens(data.tokens as ThemeTokens);
      
      return data.tokens as ThemeTokens;
    }
    
    throw new Error('Invalid data from Supabase');
  } catch (err) {
    logger.warn('Falling back to local theme:', { error: err });
    
    try {
      // Try localStorage fallback
      if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('impulse-theme');
        if (storedTheme) {
          try {
            const localTokens = JSON.parse(storedTheme) as ThemeTokens;
            logger.info('Theme loaded from localStorage', { 
              details: { source: 'local-storage' }
            });
            return localTokens;
          } catch (parseError) {
            logger.error('Error parsing localStorage theme:', { error: parseError });
          }
        }
      }
    } catch (localError) {
      logger.error('Error loading from localStorage:', { error: localError });
    }
    
    // Final fallback to static default theme
    logger.info('Using default theme', { 
      details: { source: 'static-default' }
    });
    return defaultTheme;
  }
}

/**
 * Get theme with fallback chain for the full Theme object
 */
export async function getThemeWithFallback(options: { 
  id?: string; 
  context?: ThemeContext;
}): Promise<Theme> {
  try {
    // Try to fetch from Supabase
    // Implementation would vary based on your setup
    
    // For now, we'll just use default theme
    return {
      ...defaultTheme,
      id: options.id || 'default',
      name: `Default ${options.context || 'App'} Theme`,
      status: 'published',
      context: options.context || 'app',
      is_default: true,
      design_tokens: {
        colors: defaultTheme,
        effects: {
          shadows: {},
          blurs: {},
          gradients: {},
          primary: defaultTheme.effectPrimary,
          secondary: defaultTheme.effectSecondary,
          tertiary: defaultTheme.effectTertiary
        }
      },
      component_tokens: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1
    } as Theme;
  } catch (error) {
    logger.error('Failed to get theme:', { error });
    return {
      ...defaultTheme,
      id: 'default',
      name: 'Default Theme',
      status: 'published',
      context: 'app',
      is_default: true,
      design_tokens: {
        colors: defaultTheme,
        effects: {
          shadows: {},
          blurs: {},
          gradients: {},
          primary: defaultTheme.effectPrimary,
          secondary: defaultTheme.effectSecondary,
          tertiary: defaultTheme.effectTertiary
        }
      },
      component_tokens: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1
    } as Theme;
  }
}
