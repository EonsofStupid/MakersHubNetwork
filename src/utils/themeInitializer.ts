
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { defaultImpulseTokens } from '@/admin/types/impulse.types';

export const DEFAULT_THEME_NAME = 'Impulsivity';

const logger = getLogger('themeInitializer', { category: LogCategory.THEME });

/**
 * Get a theme ID by name
 * @param name Theme name
 * @returns Theme ID if found, null otherwise
 */
export async function getThemeByName(name: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('name', name)
      .single();
      
    if (error) {
      logger.warn(`Theme not found by name: ${name}`, {
        details: { error }
      });
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    logger.error(`Error getting theme by name: ${name}`, {
      details: { error }
    });
    return null;
  }
}

/**
 * Ensure a default theme exists in the database
 * @returns ID of the default theme
 */
export async function ensureDefaultTheme(): Promise<string | null> {
  try {
    // First, check if a default theme already exists
    const { data: defaultThemes, error: defaultError } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .limit(1);
      
    if (!defaultError && defaultThemes && defaultThemes.length > 0) {
      logger.info('Default theme already exists, using it');
      return defaultThemes[0].id;
    }
    
    // Check if a theme with the default name exists
    const namedThemeId = await getThemeByName(DEFAULT_THEME_NAME);
    if (namedThemeId) {
      // Make it the default if found
      await supabase
        .from('themes')
        .update({ is_default: true })
        .eq('id', namedThemeId);
        
      logger.info(`Set existing ${DEFAULT_THEME_NAME} theme as default`);
      return namedThemeId;
    }
    
    // No default theme found, create one
    logger.info('Creating new default theme');
    
    const themeData = {
      name: DEFAULT_THEME_NAME,
      description: 'Default application theme',
      status: 'published',
      is_default: true,
      version: 1,
      design_tokens: {
        colors: {
          primary: defaultImpulseTokens.colors.primary,
          secondary: defaultImpulseTokens.colors.secondary,
          accent: defaultImpulseTokens.colors.accent,
          background: defaultImpulseTokens.colors.background,
          text: defaultImpulseTokens.colors.text,
          borders: defaultImpulseTokens.colors.borders,
          status: defaultImpulseTokens.colors.status
        },
        effects: defaultImpulseTokens.effects,
        animation: defaultImpulseTokens.animation,
        components: defaultImpulseTokens.components,
        typography: defaultImpulseTokens.typography,
        admin: defaultImpulseTokens // Store full impulse tokens in admin section
      },
      component_tokens: [],
      context: 'site'
    };
    
    const { data: newTheme, error: insertError } = await supabase
      .from('themes')
      .insert([themeData])
      .select('id')
      .single();
      
    if (insertError) {
      logger.error('Error creating default theme', {
        details: { insertError }
      });
      return null;
    }
    
    logger.info('Default theme created successfully');
    return newTheme?.id || null;
  } catch (error) {
    logger.error('Error ensuring default theme', {
      details: { error }
    });
    return null;
  }
}

/**
 * Get theme from localStorage
 */
export function getThemeFromLocalStorage(): string | null {
  try {
    const themeId = localStorage.getItem('themeId');
    return themeId;
  } catch (error) {
    logger.error('Error getting theme from localStorage', {
      details: { error }
    });
    return null;
  }
}

/**
 * Set theme in localStorage
 */
export function setThemeInLocalStorage(themeId: string): void {
  try {
    localStorage.setItem('themeId', themeId);
  } catch (error) {
    logger.error('Error setting theme in localStorage', {
      details: { error, themeId }
    });
  }
}

/**
 * Remove theme from localStorage
 */
export function removeThemeFromLocalStorage(): void {
  try {
    localStorage.removeItem('themeId');
  } catch (error) {
    logger.error('Error removing theme from localStorage', {
      details: { error }
    });
  }
}
