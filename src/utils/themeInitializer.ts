
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeInitializer', { category: LogCategory.THEME });

// Constants
export const DEFAULT_THEME_NAME = 'Impulsivity';

/**
 * Get theme ID by name - useful for fetching specific themes by name
 * @param name The name of the theme to fetch
 * @returns UUID of the theme if found, null otherwise
 */
export async function getThemeByName(name: string): Promise<string | null> {
  try {
    logger.debug(`Looking for theme by name: ${name}`);
    
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .ilike('name', name)
      .limit(1)
      .single();
    
    if (error) {
      logger.warn(`No theme found with name "${name}"`, {
        details: safeDetails(error)
      });
      return null;
    }
    
    if (!data) {
      logger.debug(`No theme found with name "${name}"`);
      return null;
    }
    
    logger.debug(`Found theme: ${name} with ID: ${data.id}`);
    return data.id;
  } catch (err) {
    logger.error(`Error fetching theme by name "${name}"`, {
      details: safeDetails(err)
    });
    return null;
  }
}

/**
 * Get default theme ID - returns the first default theme or creates one if none exists
 * @returns UUID of the default theme
 */
export async function ensureDefaultTheme(): Promise<string | null> {
  try {
    logger.debug('Looking for default theme');
    
    // First, try to find an existing default theme
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .limit(1)
      .single();
      
    if (!error && data?.id) {
      logger.debug(`Found default theme with ID: ${data.id}`);
      return data.id;
    }
    
    // If no default theme, try to find the Impulsivity theme
    const impulsivityThemeId = await getThemeByName(DEFAULT_THEME_NAME);
    if (impulsivityThemeId) {
      // Set this as the default theme
      await supabase
        .from('themes')
        .update({ is_default: true })
        .eq('id', impulsivityThemeId);
      
      logger.debug(`Set ${DEFAULT_THEME_NAME} theme as default with ID: ${impulsivityThemeId}`);
      return impulsivityThemeId;
    }
    
    // No default theme exists, let's create a minimal one
    const { data: newTheme, error: createError } = await supabase
      .from('themes')
      .insert({
        name: DEFAULT_THEME_NAME,
        description: 'Default theme for MakersImpulse',
        design_tokens: {
          colors: {
            primary: '#00F0FF',
            secondary: '#FF2D6E',
            accent: '#8B5CF6',
            background: {
              main: '#12121A',
              overlay: 'rgba(22, 24, 29, 0.85)',
              card: 'rgba(28, 32, 42, 0.7)',
              alt: '#1A1E24'
            },
            text: {
              primary: '#F6F6F7',
              secondary: 'rgba(255, 255, 255, 0.7)',
              accent: '#00F0FF',
              muted: 'rgba(255, 255, 255, 0.5)'
            }
          }
        },
        is_default: true,
        status: 'published',
      })
      .select('id')
      .single();
      
    if (createError || !newTheme) {
      logger.error('Failed to create default theme', {
        details: safeDetails(createError || 'No theme data returned')
      });
      return null;
    }
    
    logger.info(`Created new default theme with ID: ${newTheme.id}`);
    return newTheme.id;
  } catch (err) {
    logger.error('Error ensuring default theme exists', {
      details: safeDetails(err)
    });
    return null;
  }
}
