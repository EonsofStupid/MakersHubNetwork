
import { Theme } from '@/types/theme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { supabase } from '@/integrations/supabase/client';
import { keyframes } from '@/theme/animations';

/**
 * Syncs the Impulsivity theme to the database
 */
export async function syncImpulsivityTheme(): Promise<boolean> {
  const logger = getLogger();
  
  try {
    logger.info('Starting Impulsivity theme sync operation', {
      category: LogCategory.DATABASE,
      source: 'themeSync'
    });
    
    // First try to get the existing theme
    const { data, error } = await supabase.functions.invoke('theme-service', {
      body: { 
        operation: 'get-theme', 
        themeName: 'Impulsivity'
      }
    });
    
    if (error) {
      logger.error('Failed to retrieve Impulsivity theme for syncing', {
        category: LogCategory.DATABASE,
        details: error,
        source: 'themeSync'
      });
      return false;
    }
    
    // If the theme exists, update it
    if (data && data.theme && !data.isFallback) {
      const existingTheme = data.theme as Theme;
      
      // Prepare the updated theme with proper animations
      const updatedTheme = {
        ...existingTheme,
        design_tokens: {
          ...existingTheme.design_tokens,
          colors: {
            ...existingTheme.design_tokens?.colors,
            primary: '#00F0FF',
            secondary: '#FF2D6E',
            background: '#080F1E',
            foreground: '#F9FAFB',
            card: '#0E172A',
            cardForeground: '#F9FAFB'
          },
          effects: {
            shadows: existingTheme.design_tokens?.effects?.shadows || {},
            blurs: existingTheme.design_tokens?.effects?.blurs || {},
            gradients: existingTheme.design_tokens?.effects?.gradients || {},
            primary: '#00F0FF',
            secondary: '#FF2D6E',
            tertiary: '#8B5CF6'
          },
          animation: {
            keyframes: keyframes,
            transitions: {},
            durations: {
              fast: '150ms',
              normal: '300ms',
              slow: '500ms',
              animationFast: '1s',
              animationNormal: '2s',
              animationSlow: '3s',
            }
          }
        }
      };
      
      // Update the theme
      const { error: updateError } = await supabase.functions.invoke('theme-service', {
        body: { 
          operation: 'update-theme', 
          themeId: existingTheme.id,
          theme: updatedTheme,
          userId: 'system' // Use system as userId for automatic updates
        }
      });
      
      if (updateError) {
        logger.error('Failed to update Impulsivity theme', {
          category: LogCategory.DATABASE,
          details: updateError,
          source: 'themeSync'
        });
        return false;
      }
      
      logger.info('Successfully updated Impulsivity theme', {
        category: LogCategory.DATABASE,
        details: { themeId: existingTheme.id },
        source: 'themeSync'
      });
      return true;
    }
    
    // If the theme doesn't exist, create it
    const newTheme: Partial<Theme> = {
      name: 'Impulsivity',
      description: 'A cyberpunk-inspired theme with neon effects and vivid colors',
      status: 'published',
      is_default: true,
      version: 1,
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
          shadows: {},
          blurs: {},
          gradients: {},
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          tertiary: '#8B5CF6',
        },
        animation: {
          keyframes,
          transitions: {},
          durations: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
            animationFast: '1s',
            animationNormal: '2s',
            animationSlow: '3s',
          }
        }
      },
      component_tokens: []
    };
    
    // Create the new theme
    const { error: createError } = await supabase.functions.invoke('theme-service', {
      body: { 
        operation: 'create-theme', 
        theme: newTheme,
        userId: 'system'
      }
    });
    
    if (createError) {
      logger.error('Failed to create Impulsivity theme', {
        category: LogCategory.DATABASE,
        details: createError,
        source: 'themeSync'
      });
      return false;
    }
    
    logger.info('Successfully created Impulsivity theme', {
      category: LogCategory.DATABASE,
      source: 'themeSync'
    });
    
    return true;
  } catch (error) {
    logger.error('Error during Impulsivity theme sync', {
      category: LogCategory.DATABASE,
      details: error,
      source: 'themeSync'
    });
    return false;
  }
}

/**
 * Gets the freshest theme from the database or falls back to local
 */
export async function getThemeWithFallback(themeName: string = 'Impulsivity'): Promise<Theme> {
  const logger = getLogger();
  
  try {
    // Try to get from database
    const { data, error } = await supabase.functions.invoke('theme-service', {
      body: { 
        operation: 'get-theme', 
        themeName: themeName
      }
    });
    
    if (error || !data || !data.theme) {
      throw new Error('Failed to get theme from database');
    }
    
    return data.theme as Theme;
  } catch (error) {
    logger.warn('Using local fallback theme due to error', {
      category: LogCategory.DATABASE,
      details: error,
      source: 'themeSync'
    });
    
    // Return a hardcoded fallback theme
    return {
      id: "fallback-theme-" + Date.now(),
      name: "Emergency Fallback Theme",
      description: "Fallback theme used when theme loading fails",
      status: 'published',
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
          shadows: {},
          blurs: {},
          gradients: {},
          primary: "#00F0FF",
          secondary: "#FF2D6E",
          tertiary: "#8B5CF6",
        },
        animation: {
          keyframes,
          transitions: {},
          durations: {
            fast: "150ms",
            normal: "300ms",
            slow: "500ms",
            animationFast: "1s",
            animationNormal: "2s",
            animationSlow: "3s",
          }
        }
      },
      component_tokens: [],
    };
  }
}
