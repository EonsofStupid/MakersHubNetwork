
import { Theme, ThemeContext } from '@/types/theme';
import { z } from 'zod';
import { ThemeContextSchema } from '@/types/themeContext';
import { getLogger } from '@/logging';

// Use Zod to validate service options
const GetThemeOptionsSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived'] as const).optional(),
  isDefault: z.boolean().optional(),
  context: ThemeContextSchema.optional(),
});

export type GetThemeOptions = z.infer<typeof GetThemeOptionsSchema>;

interface GetThemeResponse {
  theme: Theme;
  isFallback: boolean;
}

// Fallback theme to use when no theme is found
const fallbackTheme: Theme = {
  id: 'default',
  name: 'Default',
  description: 'Default theme',
  status: 'published',
  is_default: true,
  created_by: 'system',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
  design_tokens: {
    colors: {
      primary: '186 100% 50%',
      secondary: '334 100% 59%',
      background: '228 47% 8%',
      foreground: '210 40% 98%',
    },
    effects: {
      shadows: {},
      blurs: {},
      gradients: {},
      primary: '#00F0FF',
      secondary: '#FF2D6E',
      tertiary: '#8B5CF6',
    },
  },
  component_tokens: [],
};

/**
 * Get a theme from the database or Supabase edge function
 */
export async function getTheme(options: GetThemeOptions = {}): Promise<GetThemeResponse> {
  try {
    const logger = getLogger('ThemeService');
    // Validate options with Zod
    const validOptions = GetThemeOptionsSchema.parse(options);
    logger.info('Fetching theme', { 
      details: { 
        options: validOptions,
        hasId: !!validOptions.id,
        hasContext: !!validOptions.context 
      } 
    });
    
    // Try to fetch from Supabase edge function if available
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        
        // Build the query parameters
        const params = new URLSearchParams();
        if (validOptions.id) params.append('themeId', validOptions.id);
        if (validOptions.name) params.append('themeName', validOptions.name);
        if (validOptions.context) params.append('context', validOptions.context);
        if (validOptions.isDefault !== undefined) params.append('isDefault', validOptions.isDefault.toString());
        
        const url = `${supabaseUrl}/functions/v1/theme-service?${params.toString()}`;
        logger.info('Calling theme service edge function', { details: { url } });
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Theme service responded with ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.theme) {
          logger.info('Theme loaded from edge function', { 
            details: { 
              themeName: data.theme.name,
              isFallback: data.isFallback
            } 
          });
          
          return {
            theme: data.theme,
            isFallback: data.isFallback
          };
        }
        
        // If theme not found but tokens are returned, create a fallback theme with those tokens
        if (data.tokens) {
          const fallbackWithTokens = {
            ...fallbackTheme,
            design_tokens: {
              colors: data.tokens,
              effects: {
                shadows: {},
                blurs: {},
                gradients: {},
                primary: data.tokens.effectPrimary || '#00F0FF',
                secondary: data.tokens.effectSecondary || '#FF2D6E',
                tertiary: data.tokens.effectTertiary || '#8B5CF6',
              }
            }
          };
          
          logger.warn('Using fallback theme with edge function tokens', { 
            details: { isFallback: true } 
          });
          
          return {
            theme: fallbackWithTokens,
            isFallback: true
          };
        }
      }
    } catch (error) {
      logger.error('Failed to fetch theme from edge function', { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
      // Continue to fallback implementation
    }
    
    // Fallback implementation
    logger.warn('Using memory fallback theme', { details: { reason: 'No edge function or API available' } });
    
    // Create a context-appropriate theme
    const contextTheme = {
      ...fallbackTheme,
      id: validOptions.id || fallbackTheme.id,
      name: validOptions.name || `Default ${validOptions.context || 'App'} Theme`,
      status: validOptions.status || fallbackTheme.status,
      is_default: validOptions.isDefault ?? fallbackTheme.is_default,
      design_tokens: {
        ...fallbackTheme.design_tokens,
        // Customize colors based on context
        colors: {
          ...fallbackTheme.design_tokens.colors,
          ...(validOptions.context === 'admin' ? {
            primary: '186 100% 50%', // Cyan for admin
            secondary: '334 100% 59%', // Hot pink for admin
          } : validOptions.context === 'chat' ? {
            primary: '262 80% 50%', // Purple for chat
            secondary: '160 100% 50%', // Green for chat
          } : {})
        },
        // Customize effects based on context
        effects: {
          ...fallbackTheme.design_tokens.effects,
          ...(validOptions.context === 'admin' ? {
            primary: '#00F0FF', // Cyan for admin
            secondary: '#FF2D6E', // Hot pink for admin
          } : validOptions.context === 'chat' ? {
            primary: '#8B5CF6', // Purple for chat
            secondary: '#10B981', // Green for chat
          } : {})
        }
      }
    };
    
    return {
      theme: contextTheme,
      isFallback: true
    };
  } catch (error) {
    console.error('Error fetching theme:', error);
    
    return {
      theme: fallbackTheme,
      isFallback: true
    };
  }
}

/**
 * Save a theme to the database
 */
export async function saveTheme(theme: Partial<Theme>): Promise<Theme> {
  try {
    // In a real implementation, this would save to an API or database
    // For now, we'll just return a mock response with a simulated delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const savedTheme: Theme = {
      ...fallbackTheme,
      ...theme,
      updated_at: new Date().toISOString(),
      version: (theme.version || 1) + 1,
    };
    
    return savedTheme;
  } catch (error) {
    console.error('Error saving theme:', error);
    throw error;
  }
}

/**
 * Create a new theme
 */
export async function createTheme(theme: Partial<Theme>): Promise<Theme> {
  try {
    // In a real implementation, this would create in an API or database
    // For now, we'll just return a mock response with a simulated delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newTheme: Theme = {
      ...fallbackTheme,
      ...theme,
      id: `theme-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
    };
    
    return newTheme;
  } catch (error) {
    console.error('Error creating theme:', error);
    throw error;
  }
}

/**
 * Delete a theme
 */
export async function deleteTheme(id: string): Promise<boolean> {
  try {
    // In a real implementation, this would delete from an API or database
    // For now, we'll just return a mock response with a simulated delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return true;
  } catch (error) {
    console.error('Error deleting theme:', error);
    throw error;
  }
}

/**
 * List all themes
 */
export async function listThemes(params: Record<string, unknown> = {}): Promise<Theme[]> {
  try {
    // In a real implementation, this would fetch from an API or database
    // For now, we'll just return a mock response with a simulated delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [fallbackTheme];
  } catch (error) {
    console.error('Error listing themes:', error);
    throw error;
  }
}
