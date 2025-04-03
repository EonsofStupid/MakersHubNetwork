
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { transformThemeModel } from './transformUtils';

const logger = getLogger('ThemeInitializer', { category: LogCategory.THEME as string });

export const DEFAULT_THEME_NAME = 'Impulsivity';

/**
 * Get a theme by its name
 */
export async function getThemeByName(name: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('name', name)
      .eq('status', 'published')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      logger.warn(`Theme not found by name: ${name}`);
      return null;
    }
    
    logger.debug(`Found theme by name: ${name}`, { details: { themeId: data[0].id } });
    return data[0].id;
  } catch (error) {
    logger.error(`Error getting theme by name: ${name}`, { details: safeDetails(error) });
    return null;
  }
}

/**
 * Get default theme
 */
export async function getDefaultTheme(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .eq('status', 'published')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      logger.warn('No default theme found');
      return null;
    }
    
    logger.debug('Found default theme', { details: { themeId: data[0].id } });
    return data[0].id;
  } catch (error) {
    logger.error('Error getting default theme', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Ensure default theme exists
 */
export async function ensureDefaultTheme(): Promise<string | null> {
  try {
    // Check for default theme
    const defaultThemeId = await getDefaultTheme();
    if (defaultThemeId) {
      logger.debug('Default theme found', { details: { themeId: defaultThemeId } });
      return defaultThemeId;
    }
    
    // Check for theme by name
    const themeByNameId = await getThemeByName(DEFAULT_THEME_NAME);
    if (themeByNameId) {
      logger.debug(`Found ${DEFAULT_THEME_NAME} theme`, { details: { themeId: themeByNameId } });
      
      // Set this as default
      await supabase
        .from('themes')
        .update({ is_default: true })
        .eq('id', themeByNameId);
      
      logger.info(`Set ${DEFAULT_THEME_NAME} as default theme`, { details: { themeId: themeByNameId } });
      return themeByNameId;
    }
    
    // No default theme exists, get any published theme
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('status', 'published')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    if (data && data.length > 0) {
      const fallbackThemeId = data[0].id;
      
      // Set as default
      await supabase
        .from('themes')
        .update({ is_default: true })
        .eq('id', fallbackThemeId);
      
      logger.info('Set fallback theme as default', { details: { themeId: fallbackThemeId } });
      return fallbackThemeId;
    }
    
    logger.warn('No themes available to use as default');
    return null;
  } catch (error) {
    logger.error('Error ensuring default theme', { details: safeDetails(error) });
    return null;
  }
}
