
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Theme, ComponentTokens, DesignTokensStructure } from '@/types/theme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

const logger = getLogger('themeSync', LogCategory.DATABASE);

/**
 * Sync the Impulsivity theme to the database
 */
export async function syncImpulsivityTheme(): Promise<boolean> {
  try {
    logger.info('Starting Impulsivity theme sync');
    
    // First check if the Impulsivity theme exists
    const { data: existingThemes, error: checkError } = await supabase
      .from('themes')
      .select('id, name')
      .eq('name', 'Impulsivity')
      .limit(1);
    
    if (checkError) {
      logger.error('Error checking for Impulsivity theme', { errorMessage: checkError.message });
      return false;
    }
    
    // Generate a theme ID - use existing or create new
    const themeId = existingThemes && existingThemes.length > 0
      ? existingThemes[0].id
      : uuidv4();
      
    // Basic Impulsivity theme design tokens
    const designTokens: DesignTokensStructure = {
      colors: {
        primary: '#00F0FF',
        secondary: '#FF2D6E', 
        background: '#080F1E',
        foreground: '#F9FAFB',
        card: '#0E172A',
        cardForeground: '#F9FAFB', 
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
        shadows: {},
        blurs: {},
        gradients: {},
        primary: '#00F0FF',
        secondary: '#FF2D6E',
        tertiary: '#8B5CF6',
      },
      animation: {
        keyframes: {
          'fade-in': {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' }
          },
          'fade-out': {
            '0%': { opacity: '1', transform: 'translateY(0)' },
            '100%': { opacity: '0', transform: 'translateY(-10px)' }
          },
          'pulse': {
            '0%': { opacity: '0.6' },
            '50%': { opacity: '1' },
            '100%': { opacity: '0.6' }
          },
          'float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0px)' }
          },
          'data-stream': {
            '0%': { backgroundPosition: '0% 0%' },
            '100%': { backgroundPosition: '0% 100%' }
          },
          'spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          },
          'shimmer': {
            '0%': { backgroundPosition: '200% 0' },
            '100%': { backgroundPosition: '-200% 0' }
          },
          'glitch': {
            '0%': { transform: 'translate(0)' },
            '20%': { transform: 'translate(-3px, 3px)' },
            '40%': { transform: 'translate(-3px, -3px)' },
            '60%': { transform: 'translate(3px, 3px)' },
            '80%': { transform: 'translate(3px, -3px)' },
            '100%': { transform: 'translate(0)' }
          },
          'gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        },
        transitions: {
          'default': 'all 0.3s ease',
          'slow': 'all 0.6s ease',
          'spring': 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          'bounce': 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        },
        durations: {
          'fast': '150ms',
          'normal': '300ms',
          'slow': '500ms',
          'animationFast': '1s',
          'animationNormal': '2s',
          'animationSlow': '3s'
        }
      },
      spacing: {
        radius: {
          'sm': '0.25rem',
          'md': '0.5rem',
          'lg': '0.75rem',
          'full': '9999px'
        }
      },
      typography: {
        fontSizes: {
          'xs': '0.75rem',
          'sm': '0.875rem',
          'base': '1rem',
          'lg': '1.125rem',
          'xl': '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem'
        },
        fontFamilies: {
          'sans': '"Inter", system-ui, -apple-system, sans-serif',
          'mono': '"Roboto Mono", monospace'
        },
        lineHeights: {
          'tight': '1.25',
          'normal': '1.5',
          'loose': '1.75'
        },
        letterSpacing: {
          'tight': '-0.025em',
          'normal': '0',
          'wide': '0.025em'
        }
      }
    };
    
    // Component tokens
    const componentTokens: ComponentTokens[] = [
      {
        id: uuidv4(),
        component_name: 'navbar',
        styles: {
          background: 'rgba(8, 15, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
          height: '64px'
        },
        description: 'Main navigation bar',
        theme_id: themeId,
        context: 'site'
      },
      {
        id: uuidv4(),
        component_name: 'button-primary',
        styles: {
          background: 'linear-gradient(135deg, #00F0FF 0%, #00B8F9 100%)',
          color: '#FFFFFF',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: '500',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
          hover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.7)'
          }
        },
        description: 'Primary action button',
        theme_id: themeId,
        context: 'site'
      },
      {
        id: uuidv4(),
        component_name: 'button-secondary',
        styles: {
          background: 'transparent',
          color: '#00F0FF',
          border: '1px solid #00F0FF',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: '500',
          hover: {
            background: 'rgba(0, 240, 255, 0.1)',
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
          }
        },
        description: 'Secondary action button',
        theme_id: themeId,
        context: 'site'
      },
      {
        id: uuidv4(),
        component_name: 'card',
        styles: {
          background: 'rgba(14, 23, 42, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        },
        description: 'Content card component',
        theme_id: themeId,
        context: 'site'
      }
    ];
    
    // Theme object
    const impulsivityTheme: Record<string, any> = {
      id: themeId,
      name: 'Impulsivity',
      description: 'A cyberpunk-inspired theme with neon effects and vivid colors',
      status: 'published',
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      context: 'site',
      // Convert to stringified JSON to match database schema
      design_tokens: JSON.stringify(designTokens),
      component_tokens: JSON.stringify(componentTokens)
    };
    
    // Update or insert theme
    if (existingThemes && existingThemes.length > 0) {
      // Update existing theme
      const { error: updateError } = await supabase
        .from('themes')
        .update({
          description: impulsivityTheme.description,
          updated_at: impulsivityTheme.updated_at,
          version: impulsivityTheme.version,
          design_tokens: impulsivityTheme.design_tokens,
          component_tokens: impulsivityTheme.component_tokens
        })
        .eq('id', themeId);
      
      if (updateError) {
        logger.error('Error updating Impulsivity theme', { errorMessage: updateError.message });
        return false;
      }
      
      logger.info('Successfully updated Impulsivity theme');
      return true;
    } else {
      // Insert new theme
      const { error: insertError } = await supabase
        .from('themes')
        .insert([impulsivityTheme]);
      
      if (insertError) {
        logger.error('Error inserting Impulsivity theme', { errorMessage: insertError.message });
        return false;
      }
      
      logger.info('Successfully created Impulsivity theme');
      return true;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Failed to update Impulsivity theme', { errorMessage });
    return false;
  }
}
