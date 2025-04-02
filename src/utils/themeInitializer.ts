
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';
import { LogCategory } from '@/logging';

export const DEFAULT_THEME_NAME = 'Impulsivity';
const logger = getLogger('ThemeInitializer', LogCategory.THEME);

/**
 * Get a theme ID by its name
 * Used to find the Impulsivity theme or fallback
 */
export async function getThemeByName(name: string): Promise<string | null> {
  try {
    logger.info(`Looking up theme by name: ${name}`);
    
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('name', name)
      .limit(1)
      .single();
      
    if (error) {
      logger.warn(`Error finding theme by name ${name}`, {
        details: safeDetails(error)
      });
      return null;
    }
    
    if (!data) {
      logger.warn(`No theme found with name: ${name}`);
      return null;
    }
    
    logger.debug(`Found theme: ${name} with ID: ${data.id}`);
    return data.id;
  } catch (error) {
    logger.error(`Exception while looking up theme by name ${name}`, {
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Get the default theme ID 
 */
export async function getDefaultThemeId(): Promise<string | null> {
  try {
    logger.info('Looking up default theme');
    
    const { data, error } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .limit(1)
      .single();
      
    if (error) {
      logger.warn('Error finding default theme', {
        details: safeDetails(error)
      });
      return null;
    }
    
    if (!data) {
      logger.warn('No default theme found');
      return null;
    }
    
    logger.debug(`Found default theme with ID: ${data.id}`);
    return data.id;
  } catch (error) {
    logger.error('Exception while looking up default theme', {
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Ensure default theme exists
 * First tries to find the Impulsivity theme, then falls back to the default theme,
 * and creates one if none exists
 */
export async function ensureDefaultTheme(): Promise<string> {
  try {
    // First try to find the Impulsivity theme by name
    const impulsivityId = await getThemeByName(DEFAULT_THEME_NAME);
    if (impulsivityId) {
      logger.info(`Found ${DEFAULT_THEME_NAME} theme: ${impulsivityId}`);
      return impulsivityId;
    }
    
    // If not found, look for any default theme
    const defaultId = await getDefaultThemeId();
    if (defaultId) {
      logger.info(`Using default theme: ${defaultId}`);
      return defaultId;
    }
    
    // If no default theme exists, create one
    logger.info('No default theme found, creating one');
    
    const { data, error } = await supabase
      .from('themes')
      .insert({
        name: DEFAULT_THEME_NAME,
        description: 'Default cyberpunk theme with neon accents',
        status: 'published',
        is_default: true,
        design_tokens: {
          colors: {
            background: '#12121A',
            foreground: '#F6F6F7',
            card: 'rgba(28, 32, 42, 0.7)',
            cardForeground: '#F6F6F7',
            primary: '#00F0FF',
            primaryForeground: '#F6F6F7',
            secondary: '#FF2D6E',
            secondaryForeground: '#F6F6F7',
            muted: 'rgba(255, 255, 255, 0.7)',
            mutedForeground: 'rgba(255, 255, 255, 0.5)',
            accent: '#131D35',
            accentForeground: '#F6F6F7',
            destructive: '#EF4444',
            destructiveForeground: '#F6F6F7',
            border: 'rgba(0, 240, 255, 0.2)',
            input: '#131D35',
            ring: '#1E293B'
          },
          effects: {
            primary: '#00F0FF',
            secondary: '#FF2D6E',
            tertiary: '#8B5CF6',
            shadows: {
              default: '0 4px 6px rgba(0, 0, 0, 0.1)',
              medium: '0 10px 15px rgba(0, 0, 0, 0.2)',
              large: '0 20px 25px rgba(0, 0, 0, 0.3)'
            },
            blurs: {
              default: 'blur(8px)',
              strong: 'blur(16px)'
            },
            gradients: {
              primary: 'linear-gradient(to right, #00F0FF, #00F0FF44)',
              secondary: 'linear-gradient(to right, #FF2D6E, #FF2D6E44)'
            }
          },
          animation: {
            durations: {
              fast: '150ms',
              normal: '300ms',
              slow: '500ms',
              animationFast: '1s',
              animationNormal: '2s',
              animationSlow: '3s'
            },
            keyframes: {
              fadeIn: {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 }
              },
              slideIn: {
                '0%': { transform: 'translateX(-10px)', opacity: 0 },
                '100%': { transform: 'translateX(0)', opacity: 1 }
              }
            },
            transitions: {
              default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)'
            }
          },
          spacing: {
            radius: {
              sm: '0.25rem',
              md: '0.5rem',
              lg: '0.75rem',
              full: '9999px'
            }
          },
          admin: {
            colors: {
              primary: '#00F0FF',
              secondary: '#FF2D6E',
              background: {
                main: '#12121A',
                card: 'rgba(28, 32, 42, 0.7)',
                overlay: 'rgba(22, 24, 32, 0.85)'
              },
              text: {
                primary: '#F6F6F7',
                secondary: 'rgba(255, 255, 255, 0.7)',
                accent: '#00F0FF'
              },
              borders: {
                normal: 'rgba(0, 240, 255, 0.2)',
                hover: 'rgba(0, 240, 255, 0.4)',
                active: 'rgba(0, 240, 255, 0.6)'
              }
            },
            effects: {
              glow: {
                primary: '0 0 15px rgba(0, 240, 255, 0.7)',
                secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
                hover: '0 0 20px rgba(0, 240, 255, 0.9)'
              },
              blur: {
                background: 'blur(12px)',
                overlay: 'blur(8px)'
              },
              gradients: {
                main: 'linear-gradient(to right, rgba(0, 240, 255, 0.2), rgba(255, 45, 110, 0.2))',
                accent: 'linear-gradient(45deg, rgba(0, 240, 255, 0.6), rgba(0, 240, 255, 0.2))',
                card: 'radial-gradient(circle at top right, rgba(0, 240, 255, 0.1), transparent 70%)'
              }
            },
            animation: {
              duration: {
                fast: '150ms',
                normal: '300ms',
                slow: '500ms'
              },
              curves: {
                bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
                spring: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)'
              }
            },
            components: {
              panel: {
                borderRadius: '0.75rem',
                padding: '1.5rem'
              },
              button: {
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem'
              },
              tooltip: {
                borderRadius: '0.25rem',
                padding: '0.5rem'
              }
            }
          }
        }
      })
      .select('id')
      .single();
      
    if (error) {
      logger.error('Error creating default theme', {
        details: safeDetails(error)
      });
      throw error;
    }
    
    if (!data) {
      logger.error('Failed to create default theme');
      throw new Error('Failed to create default theme');
    }
    
    logger.info(`Created default theme with ID: ${data.id}`);
    return data.id;
  } catch (error) {
    logger.error('Exception ensuring default theme', {
      details: safeDetails(error)
    });
    throw error;
  }
}
