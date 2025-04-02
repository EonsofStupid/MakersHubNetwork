
import { supabase } from '@/integrations/supabase/client';
import { isValidUUID } from '@/logging/utils/type-guards';
import { getLogger } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeInitializer');

// Standardize the theme name to "Impulsivity" throughout the application
export const DEFAULT_THEME_NAME = 'Impulsivity';

/**
 * Retrieves a theme ID by its name
 * @param themeName The name of the theme to retrieve
 * @returns The theme ID or null if not found
 */
export async function getThemeByName(themeName: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('name', themeName)
      .limit(1)
      .single();
      
    if (error) {
      logger.warn(`Error finding theme by name "${themeName}"`, { 
        details: safeDetails(error) 
      });
      throw error;
    }
    
    if (!data) {
      logger.warn(`No theme found with name "${themeName}"`);
      return null;
    }
    
    return data.id;
  } catch (err) {
    logger.error(`Failed to get theme by name "${themeName}"`, { details: safeDetails(err) });
    throw err;
  }
}

/**
 * Ensures that a default theme exists, and returns its ID
 * @returns The ID of the default theme
 */
export async function ensureDefaultTheme(): Promise<string> {
  try {
    // First try to get existing default theme
    const { data: existingDefault, error: getError } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .limit(1)
      .maybeSingle();
      
    if (!getError && existingDefault && existingDefault.id) {
      logger.debug('Found existing default theme', { details: { id: existingDefault.id } });
      return existingDefault.id;
    }
    
    // If no default theme, try to find the Impulsivity theme
    const impulsivityThemeId = await getThemeByName(DEFAULT_THEME_NAME);
    if (impulsivityThemeId) {
      logger.debug(`Found ${DEFAULT_THEME_NAME} theme, setting as default`, { details: { id: impulsivityThemeId } });
      
      // Make it the default
      const { error: updateError } = await supabase
        .from('themes')
        .update({ is_default: true })
        .eq('id', impulsivityThemeId);
        
      if (updateError) {
        logger.warn(`Error setting ${DEFAULT_THEME_NAME} theme as default`, { details: safeDetails(updateError) });
      }
      
      return impulsivityThemeId;
    }
    
    // Create a new default theme if none exists
    logger.info('Creating new default theme');
    const defaultTheme = {
      name: DEFAULT_THEME_NAME,
      description: `Default ${DEFAULT_THEME_NAME} theme`,
      status: 'published',
      is_default: true,
      design_tokens: {
        colors: {
          background: '#080F1E',
          foreground: '#F9FAFB',
          card: '#0E172A',
          cardForeground: '#F9FAFB',
          primary: '#00F0FF',
          primaryForeground: '#F9FAFB',
          secondary: '#FF2D6E',
          secondaryForeground: '#F9FAFB',
          muted: '#131D35',
          mutedForeground: '#94A3B8',
          accent: '#131D35',
          accentForeground: '#F9FAFB',
          destructive: '#EF4444',
          destructiveForeground: '#F9FAFB',
          border: '#131D35',
          input: '#131D35',
          ring: '#1E293B',
        },
        effects: {
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          tertiary: '#8B5CF6',
        },
        animation: {
          durations: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
            animationFast: '1s',
            animationNormal: '2s',
            animationSlow: '3s',
          }
        },
        spacing: {
          radius: {
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem',
            full: '9999px',
          }
        }
      },
    };
    
    const { data: newTheme, error: createError } = await supabase
      .from('themes')
      .insert(defaultTheme)
      .select()
      .single();
      
    if (createError) {
      logger.error('Error creating default theme', { details: safeDetails(createError) });
      throw createError;
    }
    
    if (!newTheme) {
      throw new Error('Failed to create default theme - no data returned');
    }
    
    logger.info('Created new default theme', { details: { id: newTheme.id } });
    return newTheme.id;
  } catch (err) {
    logger.error('Failed to ensure default theme', { details: safeDetails(err) });
    throw err;
  }
}

/**
 * Validates if the given theme ID exists
 * @param themeId The theme ID to check
 * @returns True if the theme exists, false otherwise
 */
export async function validateThemeExists(themeId: string): Promise<boolean> {
  try {
    if (!isValidUUID(themeId)) {
      logger.warn('Invalid theme ID format', { details: { themeId } });
      return false;
    }
    
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('id', themeId)
      .limit(1)
      .single();
      
    if (error) {
      logger.warn('Error validating theme', { details: safeDetails(error) });
      return false;
    }
    
    return !!data;
  } catch (err) {
    logger.error('Failed to validate theme', { details: safeDetails(err) });
    return false;
  }
}
