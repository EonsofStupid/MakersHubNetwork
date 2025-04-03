
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeInitializer', { category: LogCategory.THEME });

export const DEFAULT_THEME_NAME = 'Impulsivity';

/**
 * Get theme ID by name
 */
export async function getThemeByName(name: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('name', name)
      .limit(1)
      .single();
    
    if (error) {
      logger.warn(`Error finding theme with name "${name}"`, { details: safeDetails(error) });
      return null;
    }
    
    if (!data) {
      logger.warn(`No theme found with name "${name}"`);
      return null;
    }
    
    logger.info(`Found theme "${name}" with ID ${data.id}`);
    return data.id;
  } catch (error) {
    logger.error('Error getting theme by name', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Get the default theme ID
 */
export async function getDefaultTheme(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .limit(1)
      .single();
    
    if (error) {
      logger.warn('Error finding default theme', { details: safeDetails(error) });
      return null;
    }
    
    if (!data) {
      logger.warn('No default theme found');
      return null;
    }
    
    logger.info(`Found default theme with ID ${data.id}`);
    return data.id;
  } catch (error) {
    logger.error('Error getting default theme', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Ensure a default theme exists, or create one if it doesn't
 */
export async function ensureDefaultTheme(): Promise<string | null> {
  try {
    // First, try to get the default theme
    const defaultThemeId = await getDefaultTheme();
    if (defaultThemeId) {
      logger.info('Found existing default theme', { details: { id: defaultThemeId } });
      return defaultThemeId;
    }
    
    // If default theme doesn't exist, try to get any theme
    const { data: anyTheme, error: anyError } = await supabase
      .from('themes')
      .select('id')
      .limit(1)
      .single();
    
    if (!anyError && anyTheme) {
      logger.info('No default theme found, using first available theme', { details: { id: anyTheme.id } });
      return anyTheme.id;
    }
    
    // If no themes exist at all, we're in a bad state
    logger.error('No themes found in the database');
    return null;
  } catch (error) {
    logger.error('Error ensuring default theme', { details: safeDetails(error) });
    return null;
  }
}
