
import { supabase } from '@/lib/supabase';
import { getLogger } from '@/logging';
import { Theme, ThemeContext } from '@/types/theme';
import { ThemeTokensSchema } from '@/theme/tokenSchema';
import defaultTheme from '@/theme/defaultTheme';

const logger = getLogger('ThemeLoader');

/**
 * Safe wrapper for localStorage to prevent SSR issues
 */
export function safeLocalStorage<T>(key: string, fallback: T, parse = true): T {
  try {
    if (typeof window === 'undefined') return fallback;
    
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    
    return parse ? JSON.parse(value) : (value as unknown as T);
  } catch (error) {
    logger.warn('Error accessing localStorage:', { error });
    return fallback;
  }
}

/**
 * Save theme tokens to localStorage for offline use
 */
export function persistThemeTokens(tokens: ThemeTokensSchema): void {
  try {
    localStorage.setItem('impulse-theme', JSON.stringify(tokens));
    logger.info('Theme tokens persisted to localStorage');
  } catch (error) {
    logger.error('Failed to persist theme tokens:', { error });
  }
}

/**
 * Load theme tokens with fallback chain:
 * 1. From Supabase edge function
 * 2. From localStorage
 * 3. From static default theme
 */
export async function loadThemeTokens(context: ThemeContext = 'site'): Promise<ThemeTokensSchema> {
  logger.info('Loading theme tokens', { details: { context } });
  
  try {
    // Try loading from Supabase with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Supabase timeout')), 3000);
    });
    
    // Try to get theme from Supabase edge function
    const themePromise = supabase.functions.invoke(theme-service', { 
      body: { context } 
    });
    
    const result = await Promise.race([themePromise, timeoutPromise]) as {
      data: { tokens: ThemeTokensSchema; } | null;
      error: Error | null;
    };
    
    if (result.error) {
      throw new Error(`Supabase error: ${result.error.message}`);
    }
    
    if (result.data?.tokens) {
      logger.info('Theme loaded from Supabase', { source: 'edge-function' });
      
      // Persist for future offline use
      persistThemeTokens(result.data.tokens);
      
      return result.data.tokens;
    }
    
    throw new Error('Invalid data from Supabase');
  } catch (err) {
    logger.warn('Falling back to local theme:', { error: err });
    
    try {
      // Try localStorage fallback
      const localTokens = safeLocalStorage<ThemeTokensSchema | null>('impulse-theme', null);
      
      if (localTokens) {
        logger.info('Theme loaded from localStorage', { source: 'local-storage' });
        return localTokens;
      }
    } catch (localError) {
      logger.error('Error loading from localStorage:', { error: localError });
    }
    
    // Final fallback to static default theme
    logger.info('Using default theme', { source: 'static-default' });
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
    } as unknown as Theme;
  } catch (error) {
    logger.error('Failed to get theme:', { error });
    return defaultTheme as unknown as Theme;
  }
}
