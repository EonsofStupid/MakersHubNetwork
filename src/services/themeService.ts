
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
 * Default fallback theme used when theme service fails
 */
const fallbackTheme: Theme = {
  id: "fallback-theme",
  name: "Fallback Theme",
  description: "Emergency fallback theme used when theme service is unavailable",
  status: "published",
  is_default: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
  design_tokens: {
    colors: {
      background: "#080F1E",
      foreground: "#F9FAFB",
      card: "#0E172A",
      cardForeground: "#F9FAFB",
      primary: "#00F0FF",
      primaryForeground: "#F9FAFB",
      secondary: "#FF2D6E",
      secondaryForeground: "#F9FAFB",
      muted: "#131D35",
      mutedForeground: "#94A3B8",
      accent: "#131D35",
      accentForeground: "#F9FAFB",
      destructive: "#EF4444",
      destructiveForeground: "#F9FAFB",
      border: "#131D35",
      input: "#131D35",
      ring: "#1E293B",
    },
    effects: {
      primary: "#00F0FF",
      secondary: "#FF2D6E",
      tertiary: "#8B5CF6",
    },
    animation: {
      durations: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
        animationFast: "1s",
        animationNormal: "2s",
        animationSlow: "3s",
      }
    },
    spacing: {
      radius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        full: "9999px",
      }
    }
  },
  component_tokens: [],
  composition_rules: {},
  cached_styles: {}
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
        themeId: themeId || undefined,
        isDefault: !themeId,
        context: 'site',
      },
    });
    
    if (error) {
      logger.error('Error fetching theme', { error });
      return { theme: fallbackTheme, isFallback: true };
    }
    
    if (!data || !data.theme) {
      logger.error('No theme data returned', { data });
      return { theme: fallbackTheme, isFallback: true };
    }
    
    logger.info('Theme fetched successfully', { 
      themeId: data.theme.id,
      isFallback: data.isFallback
    });
    
    return {
      theme: validateTheme(data.theme),
      isFallback: !!data.isFallback
    };
  } catch (error) {
    logger.error('Failed to fetch theme', { error });
    return { theme: fallbackTheme, isFallback: true };
  }
}

/**
 * Validates and normalizes a theme to ensure it has all required properties
 */
function validateTheme(theme: any): Theme {
  // Ensure we have a valid theme object
  if (!theme || typeof theme !== 'object') {
    logger.error('Invalid theme object', { theme });
    return fallbackTheme;
  }

  // Ensure required properties exist
  if (!theme.id || !theme.name || !theme.status) {
    logger.warn('Theme missing required properties, using defaults', { theme });
  }

  // Ensure design_tokens exist
  if (!theme.design_tokens || typeof theme.design_tokens !== 'object') {
    logger.warn('Theme missing design_tokens, using defaults', { theme });
    theme.design_tokens = fallbackTheme.design_tokens;
  }

  // Normalize component_tokens to ensure it's always an array
  if (!Array.isArray(theme.component_tokens)) {
    logger.warn('Theme component_tokens is not an array, normalizing', { 
      componentTokensType: typeof theme.component_tokens 
    });
    theme.component_tokens = [];
  }

  return theme as Theme;
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
    return validateTheme(data.theme);
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
    return validateTheme(data.theme);
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
