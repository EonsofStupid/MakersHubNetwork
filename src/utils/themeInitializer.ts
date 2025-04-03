
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { defaultImpulseTokens } from '@/admin/types/impulse.types';

const logger = getLogger('ThemeInitializer', { category: LogCategory.THEME as string });

// Default theme name
export const DEFAULT_THEME_NAME = 'Impulsivity';

/**
 * Get a theme ID by name
 */
export async function getThemeByName(name: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('name', name)
      .eq('status', 'published')
      .single();
    
    if (error) {
      logger.warn(`No theme found with name: ${name}`, { 
        details: safeDetails(error)
      });
      return null;
    }
    
    if (!data) {
      logger.warn(`No theme found with name: ${name}`);
      return null;
    }
    
    return data.id;
  } catch (error) {
    logger.error('Error fetching theme by name', { 
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Ensure a default theme exists in the database
 * Returns the ID of the default theme
 */
export async function ensureDefaultTheme(): Promise<string | null> {
  try {
    // First, check if a default theme already exists
    const { data: existingDefault, error: defaultError } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .eq('status', 'published')
      .limit(1)
      .single();
    
    if (!defaultError && existingDefault?.id) {
      logger.debug('Default theme already exists', { 
        details: { id: existingDefault.id }
      });
      return existingDefault.id;
    }
    
    // Next, check if the Impulsivity theme exists but isn't set as default
    const { data: impulsivityTheme, error: nameError } = await supabase
      .from('themes')
      .select('id')
      .eq('name', DEFAULT_THEME_NAME)
      .eq('status', 'published')
      .limit(1)
      .single();
    
    if (!nameError && impulsivityTheme?.id) {
      // Set this theme as default
      const { error: updateError } = await supabase
        .from('themes')
        .update({ is_default: true })
        .eq('id', impulsivityTheme.id);
      
      if (updateError) {
        logger.warn('Failed to set Impulsivity theme as default', {
          details: safeDetails(updateError)
        });
      } else {
        logger.info('Set existing Impulsivity theme as default', {
          details: { id: impulsivityTheme.id }
        });
      }
      
      return impulsivityTheme.id;
    }
    
    // If no default theme exists, create one
    const { data: newTheme, error: createError } = await supabase
      .from('themes')
      .insert({
        name: DEFAULT_THEME_NAME,
        description: 'Default cyberpunk-inspired theme for MakersImpulse',
        status: 'published',
        is_default: true,
        version: 1,
        design_tokens: defaultImpulseTokens,
        component_tokens: []
      })
      .select()
      .single();
    
    if (createError) {
      logger.error('Failed to create default theme', {
        details: safeDetails(createError)
      });
      return null;
    }
    
    logger.info('Created new default theme', {
      details: { id: newTheme.id }
    });
    return newTheme.id;
  } catch (error) {
    logger.error('Error ensuring default theme', {
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Helper function to check if theme exists and create it if not
 */
export async function getOrCreateTheme(name: string, themeData: any): Promise<string | null> {
  try {
    // First check if theme already exists
    const { data: existingTheme, error: checkError } = await supabase
      .from('themes')
      .select('id')
      .eq('name', name)
      .limit(1)
      .single();
    
    if (!checkError && existingTheme?.id) {
      logger.debug(`Theme '${name}' already exists`, {
        details: { id: existingTheme.id }
      });
      return existingTheme.id;
    }
    
    // Create new theme if not exists
    const { data: newTheme, error: createError } = await supabase
      .from('themes')
      .insert({
        name,
        description: themeData.description || `${name} theme`,
        status: 'published',
        is_default: false,
        version: 1,
        design_tokens: themeData,
        component_tokens: []
      })
      .select()
      .single();
    
    if (createError) {
      logger.error(`Failed to create '${name}' theme`, {
        details: safeDetails(createError)
      });
      return null;
    }
    
    logger.info(`Created new '${name}' theme`, {
      details: { id: newTheme.id }
    });
    return newTheme.id;
  } catch (error) {
    logger.error(`Error getting or creating '${name}' theme`, {
      details: safeDetails(error)
    });
    return null;
  }
}
