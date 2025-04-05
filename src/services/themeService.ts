
import { supabase } from "@/integrations/supabase/client";
import { Theme } from "@/types/theme";

// Create a logger for the theme service
const logger = {
  info: (message: string, details?: any) => 
    console.info(`[ThemeService] ${message}`, details),
  error: (message: string, details?: any) => 
    console.error(`[ThemeService] ${message}`, details),
  warn: (message: string, details?: any) => 
    console.warn(`[ThemeService] ${message}`, details)
};

/**
 * Fetches a theme via the service role function
 */
export async function getTheme(themeId?: string): Promise<{theme: Theme, isFallback: boolean}> {
  try {
    logger.info('Fetching theme', { themeId: themeId || 'default' });
    
    const { data, error } = await supabase.functions.invoke('theme-service', {
      body: {
        operation: 'get-theme',
        themeId,
        isDefault: !themeId,
        context: 'site',
      },
    });
    
    if (error) {
      logger.error('Error fetching theme', { error });
      throw error;
    }
    
    if (!data || !data.theme) {
      logger.error('No theme data returned', { data });
      throw new Error('No theme data returned from service');
    }
    
    logger.info('Theme fetched successfully', { 
      themeId: data.theme.id,
      isFallback: data.isFallback
    });
    
    return {
      theme: data.theme as Theme,
      isFallback: !!data.isFallback
    };
  } catch (error) {
    logger.error('Failed to fetch theme', { error });
    throw error;
  }
}

/**
 * Updates a theme via the service role function (requires authentication)
 */
export async function updateTheme(themeId: string, theme: Partial<Theme>): Promise<Theme> {
  try {
    // Get user id from session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      throw new Error('Authentication required for theme updates');
    }
    
    const userId = sessionData.session.user.id;
    logger.info('Updating theme', { themeId, userId });
    
    const { data, error } = await supabase.functions.invoke('theme-service', {
      body: {
        operation: 'update-theme',
        themeId,
        theme,
        userId
      },
    });
    
    if (error) {
      logger.error('Error updating theme', { error });
      throw error;
    }
    
    if (!data || !data.theme) {
      logger.error('No theme data returned after update', { data });
      throw new Error('No theme data returned from service');
    }
    
    logger.info('Theme updated successfully', { themeId: data.theme.id });
    return data.theme as Theme;
  } catch (error) {
    logger.error('Failed to update theme', { error });
    throw error;
  }
}

/**
 * Creates a new theme via the service role function (requires authentication)
 */
export async function createTheme(theme: Partial<Theme>): Promise<Theme> {
  try {
    // Get user id from session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      throw new Error('Authentication required for theme creation');
    }
    
    const userId = sessionData.session.user.id;
    logger.info('Creating new theme', { userId });
    
    const { data, error } = await supabase.functions.invoke('theme-service', {
      body: {
        operation: 'create-theme',
        theme,
        userId
      },
    });
    
    if (error) {
      logger.error('Error creating theme', { error });
      throw error;
    }
    
    if (!data || !data.theme) {
      logger.error('No theme data returned after creation', { data });
      throw new Error('No theme data returned from service');
    }
    
    logger.info('Theme created successfully', { themeId: data.theme.id });
    return data.theme as Theme;
  } catch (error) {
    logger.error('Failed to create theme', { error });
    throw error;
  }
}

/**
 * Ensures a default theme exists
 */
export async function ensureDefaultTheme(): Promise<string | null> {
  try {
    logger.info('Ensuring default theme exists');
    
    // Try to get the default theme
    const { theme, isFallback } = await getTheme();
    
    // If we got a real theme (not the fallback), return its ID
    if (!isFallback && theme.id) {
      logger.info('Found existing default theme', { id: theme.id });
      return theme.id;
    }
    
    // If we're using the fallback, check if user is authenticated to create a real theme
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      logger.warn('No default theme found and not authenticated to create one');
      return null;
    }
    
    // Create a new default theme
    logger.info('Creating new default theme');
    const newTheme = await createTheme({
      name: 'Default Theme',
      description: 'The default system theme',
      status: 'published',
      is_default: true,
      version: 1,
      design_tokens: theme.design_tokens,
      component_tokens: [],
      composition_rules: {},
      cached_styles: {}
    });
    
    return newTheme.id;
  } catch (error) {
    logger.error('Failed to ensure default theme', { error });
    return null;
  }
}
