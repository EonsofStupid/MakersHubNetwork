
import { useState, useEffect, useContext } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';
import { ThemeContext } from '@/types/theme';

// Define theme context types
export type ThemeContextValues = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  foregroundColor: string;
  fontFamily: string;
  borderRadius: string;
};

// Use the proper ThemeContext type
export type ThemeScope = ThemeContext | 'global';

const logger = getLogger('ThemeContext', LogCategory.THEME);

/**
 * Hook for accessing and managing theme context for admin interface
 */
export function useThemeContext(scope: ThemeScope = 'admin') {
  const [themeData, setThemeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAdmin } = useAuth();

  // Load theme data from database
  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsLoading(true);
        logger.info('Loading theme data', { details: { scope } });
        
        // Query the default theme or a specific user theme
        const { data, error } = await supabase
          .from('themes')
          .select('*')
          .eq('is_default', true)
          .limit(1)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          logger.warn('No theme data found, using defaults');
          return;
        }
        
        // Process theme data
        setThemeData(data);
        logger.info('Theme data loaded successfully');
      } catch (err) {
        logger.error('Failed to load theme data', { details: safeDetails(err) });
        setError(err instanceof Error ? err : new Error('Unknown error loading theme'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, [scope, user?.id]);

  // Apply theme override for admin scope if user is admin
  const getDesignTokens = () => {
    if (!themeData) return {};
    
    try {
      if (scope === 'admin' && themeData.design_tokens?.admin) {
        return themeData.design_tokens.admin;
      }
      
      return themeData.design_tokens || {};
    } catch (error) {
      logger.error('Error processing design tokens', { details: safeDetails(error) });
      return {};
    }
  };

  // Extract theme values for current scope
  const getThemeValues = (): ThemeContextValues => {
    const tokens = getDesignTokens();
    
    // Extract values with fallbacks
    return {
      primaryColor: tokens?.colors?.primary || '#00F0FF',
      secondaryColor: tokens?.colors?.secondary || '#FF2D6E',
      backgroundColor: tokens?.colors?.background?.main || '#12121A',
      foregroundColor: tokens?.colors?.text?.primary || '#F6F6F7',
      fontFamily: tokens?.typography?.fonts?.body || 'system-ui, sans-serif',
      borderRadius: tokens?.components?.panel?.radius || '0.5rem',
    };
  };

  return {
    themeData,
    isLoading,
    error,
    themeValues: getThemeValues(),
    scope,
  };
}
