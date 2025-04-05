
import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultImpulseTokens } from '../impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { applyThemeToDocument } from '../utils/themeApplicator';
import { deepMerge } from '../utils/themeUtils';
import { supabase } from '@/integrations/supabase/client';
import { AdminTheme, ThemeContextValue } from '@/admin/types/theme';

// Create context with default values
const ThemeContext = createContext<ThemeContextValue>({
  currentTheme: null,
  isLoading: false,
  error: null,
  applyTheme: async () => {},
  updateTheme: () => {},
  saveTheme: async () => {},
  resetTheme: () => {},
  isDirty: false,
  isSaving: false
});

// Admin theme provider props
interface AdminThemeProviderProps {
  children: React.ReactNode;
  defaultThemeId?: string;
}

// Hook to use the theme context
export const useAdminTheme = () => useContext(ThemeContext);

// Admin theme provider component
export function AdminThemeProvider({ children, defaultThemeId }: AdminThemeProviderProps) {
  // State variables
  const [currentTheme, setCurrentTheme] = useState<AdminTheme | null>(null);
  const [originalTheme, setOriginalTheme] = useState<AdminTheme | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Logger for theme operations
  const logger = getLogger('AdminThemeContext', { category: LogCategory.THEME });
  
  // Load the theme on component mount if a defaultThemeId is provided
  useEffect(() => {
    if (defaultThemeId) {
      applyTheme(defaultThemeId).catch(err => {
        logger.error('Error loading default theme', { 
          details: safeDetails(err) 
        });
      });
    }
  }, [defaultThemeId]);
  
  // Derived state to detect if theme has been modified
  const isDirty = !!originalTheme && !!currentTheme && JSON.stringify(originalTheme) !== JSON.stringify(currentTheme);
  
  // Function to load and apply a theme
  const applyTheme = async (themeId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get theme from database
      const { data, error: fetchError } = await supabase
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();
        
      if (fetchError) {
        throw new Error(`Failed to load theme: ${fetchError.message}`);
      }
      
      if (!data) {
        throw new Error(`Theme not found: ${themeId}`);
      }
      
      // Process and normalize the theme
      const designTokens = data.design_tokens || {};
      
      // Create an AdminTheme object
      const adminTheme: AdminTheme = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        design_tokens: designTokens,
        
        // Convert from design_tokens to Impulse format
        impulse: {
          id: data.id,
          name: data.name,
          version: '1.0',
          
          // Map colors to Impulse format
          colors: {
            primary: designTokens.colors?.primary || defaultImpulseTokens.colors.primary,
            secondary: designTokens.colors?.secondary || defaultImpulseTokens.colors.secondary,
            accent: designTokens.colors?.accent || defaultImpulseTokens.colors.accent || '#8B5CF6',
            
            background: {
              main: designTokens.colors?.background || defaultImpulseTokens.colors.background.main,
              overlay: designTokens.colors?.cardBackground || defaultImpulseTokens.colors.background.overlay,
              card: designTokens.colors?.card || defaultImpulseTokens.colors.background.card,
              alt: designTokens.colors?.accent || defaultImpulseTokens.colors.background.alt
            },
            
            text: {
              primary: designTokens.colors?.foreground || defaultImpulseTokens.colors.text.primary,
              secondary: designTokens.colors?.mutedForeground || defaultImpulseTokens.colors.text.secondary,
              accent: designTokens.colors?.primary || defaultImpulseTokens.colors.text.accent,
              muted: designTokens.colors?.muted || defaultImpulseTokens.colors.text.muted
            },
            
            borders: {
              normal: designTokens.colors?.border || defaultImpulseTokens.colors.borders.normal,
              hover: designTokens.colors?.ring || defaultImpulseTokens.colors.borders.hover,
              active: designTokens.colors?.primary || defaultImpulseTokens.colors.borders.active,
              focus: designTokens.colors?.ring || defaultImpulseTokens.colors.borders.focus
            },
            
            status: {
              success: designTokens.colors?.success || defaultImpulseTokens.colors.status.success,
              warning: designTokens.colors?.warning || defaultImpulseTokens.colors.status.warning,
              error: designTokens.colors?.destructive || defaultImpulseTokens.colors.status.error,
              info: designTokens.colors?.info || defaultImpulseTokens.colors.status.info
            }
          },
          
          // Map effects to Impulse format
          effects: {
            glow: {
              primary: designTokens.effects?.primaryGlow || defaultImpulseTokens.effects.glow.primary,
              secondary: designTokens.effects?.secondaryGlow || defaultImpulseTokens.effects.glow.secondary,
              hover: designTokens.effects?.hoverGlow || defaultImpulseTokens.effects.glow.hover
            },
            
            gradients: {
              primary: designTokens.effects?.primaryGradient || defaultImpulseTokens.effects.gradients.primary,
              secondary: designTokens.effects?.secondaryGradient || defaultImpulseTokens.effects.gradients.secondary,
              accent: designTokens.effects?.accentGradient || defaultImpulseTokens.effects.gradients.accent
            },
            
            shadows: {
              small: designTokens.effects?.shadowSmall || defaultImpulseTokens.effects.shadows.small,
              medium: designTokens.effects?.shadowMedium || defaultImpulseTokens.effects.shadows.medium,
              large: designTokens.effects?.shadowLarge || defaultImpulseTokens.effects.shadows.large,
              inner: designTokens.effects?.shadowInner || defaultImpulseTokens.effects.shadows.inner
            }
          },
          
          // Map animation values to Impulse format
          animation: {
            duration: {
              fast: designTokens.animation?.durationFast || defaultImpulseTokens.animation.duration.fast,
              normal: designTokens.animation?.durationNormal || defaultImpulseTokens.animation.duration.normal,
              slow: designTokens.animation?.durationSlow || defaultImpulseTokens.animation.duration.slow
            },
            
            curves: {
              bounce: designTokens.animation?.curveBounce || defaultImpulseTokens.animation.curves.bounce,
              ease: designTokens.animation?.curveEase || defaultImpulseTokens.animation.curves.ease,
              spring: designTokens.animation?.curveSpring || defaultImpulseTokens.animation.curves.spring,
              linear: designTokens.animation?.curveLinear || defaultImpulseTokens.animation.curves.linear
            },
            
            keyframes: {
              fade: '',
              pulse: '',
              glow: '',
              slide: ''
            }
          },
          
          // Map component styles to Impulse format
          components: {
            panel: {
              radius: designTokens.radius?.lg || defaultImpulseTokens.components.panel.radius,
              padding: '1.5rem',
              background: designTokens.colors?.card || defaultImpulseTokens.components.panel.background
            },
            
            button: {
              radius: designTokens.radius?.md || defaultImpulseTokens.components.button.radius,
              padding: '0.5rem 1rem',
              transition: `all ${designTokens.animation?.durationNormal || defaultImpulseTokens.animation.duration.normal} ease`
            },
            
            tooltip: {
              radius: designTokens.radius?.sm || defaultImpulseTokens.components.tooltip.radius,
              padding: '0.5rem',
              background: 'rgba(0, 0, 0, 0.8)'
            },
            
            input: {
              radius: designTokens.radius?.md || defaultImpulseTokens.components.input.radius,
              padding: '0.5rem 0.75rem',
              background: designTokens.colors?.input || defaultImpulseTokens.components.input.background
            }
          },
          
          // Add typography settings
          typography: {
            fonts: {
              body: designTokens.fontFamily?.sans || defaultImpulseTokens.typography.fonts.body,
              heading: designTokens.fontFamily?.heading || defaultImpulseTokens.typography.fonts.heading,
              monospace: designTokens.fontFamily?.mono || defaultImpulseTokens.typography.fonts.monospace
            },
            
            sizes: {
              xs: designTokens.fontSize?.xs || defaultImpulseTokens.typography.sizes.xs,
              sm: designTokens.fontSize?.sm || defaultImpulseTokens.typography.sizes.sm,
              md: designTokens.fontSize?.base || defaultImpulseTokens.typography.sizes.md,
              lg: designTokens.fontSize?.lg || defaultImpulseTokens.typography.sizes.lg,
              xl: designTokens.fontSize?.xl || defaultImpulseTokens.typography.sizes.xl,
              '2xl': designTokens.fontSize?.['2xl'] || defaultImpulseTokens.typography.sizes['2xl'],
              '3xl': designTokens.fontSize?.['3xl'] || defaultImpulseTokens.typography.sizes['3xl']
            },
            
            weights: {
              light: 300,
              normal: 400,
              medium: 500,
              bold: 700
            },
            
            lineHeights: {
              tight: designTokens.lineHeight?.tight || defaultImpulseTokens.typography.lineHeights.tight,
              normal: designTokens.lineHeight?.normal || defaultImpulseTokens.typography.lineHeights.normal,
              loose: designTokens.lineHeight?.loose || defaultImpulseTokens.typography.lineHeights.loose
            }
          }
        }
      };
      
      // Set the themes
      setCurrentTheme(adminTheme);
      setOriginalTheme(adminTheme);
      
      // Apply the theme to the document
      applyThemeToDocument(adminTheme.impulse);
      
      logger.info(`Theme ${themeId} loaded and applied successfully`);
    } catch (err) {
      logger.error('Error applying theme', {
        details: safeDetails(err)
      });
      
      setError(err instanceof Error ? err : new Error('Unknown error applying theme'));
      
      // Apply default theme as fallback
      applyThemeToDocument(defaultImpulseTokens);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update theme properties
  const updateTheme = (updates: Partial<ImpulseTheme>) => {
    if (!currentTheme) return;
    
    try {
      // Merge the updates with the current theme
      const updatedImpulseTheme = deepMerge(currentTheme.impulse, updates);
      
      // Apply the updated theme to the document
      applyThemeToDocument(updatedImpulseTheme);
      
      // Update the current theme state
      setCurrentTheme({
        ...currentTheme,
        impulse: updatedImpulseTheme
      });
      
      logger.debug('Theme updated successfully');
    } catch (err) {
      logger.error('Error updating theme', {
        details: safeDetails(err)
      });
      
      setError(err instanceof Error ? err : new Error('Unknown error updating theme'));
    }
  };
  
  // Function to save theme to database
  const saveTheme = async () => {
    if (!currentTheme || !currentTheme.id) {
      logger.warn('No current theme to save');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Convert the Impulse theme structure to design_tokens format
      const designTokens = {
        colors: {
          // Main colors
          primary: currentTheme.impulse.colors.primary,
          secondary: currentTheme.impulse.colors.secondary,
          accent: currentTheme.impulse.colors.accent,
          
          // Background colors
          background: currentTheme.impulse.colors.background.main,
          card: currentTheme.impulse.colors.background.card,
          
          // Text colors
          foreground: currentTheme.impulse.colors.text.primary,
          muted: currentTheme.impulse.colors.text.secondary,
          mutedForeground: currentTheme.impulse.colors.text.muted,
          
          // UI colors
          border: currentTheme.impulse.colors.borders.normal,
          ring: currentTheme.impulse.colors.borders.hover,
          input: currentTheme.impulse.colors.background.alt,
          
          // Status colors
          success: currentTheme.impulse.colors.status.success,
          warning: currentTheme.impulse.colors.status.warning,
          destructive: currentTheme.impulse.colors.status.error,
          info: currentTheme.impulse.colors.status.info
        },
        
        // Effects
        effects: {
          primaryGlow: currentTheme.impulse.effects.glow.primary,
          secondaryGlow: currentTheme.impulse.effects.glow.secondary,
          hoverGlow: currentTheme.impulse.effects.glow.hover,
          
          primaryGradient: currentTheme.impulse.effects.gradients.primary,
          secondaryGradient: currentTheme.impulse.effects.gradients.secondary,
          accentGradient: currentTheme.impulse.effects.gradients.accent,
          
          shadowSmall: currentTheme.impulse.effects.shadows.small,
          shadowMedium: currentTheme.impulse.effects.shadows.medium,
          shadowLarge: currentTheme.impulse.effects.shadows.large,
          shadowInner: currentTheme.impulse.effects.shadows.inner
        },
        
        // Animation
        animation: {
          durationFast: currentTheme.impulse.animation.duration.fast,
          durationNormal: currentTheme.impulse.animation.duration.normal,
          durationSlow: currentTheme.impulse.animation.duration.slow,
          
          curveBounce: currentTheme.impulse.animation.curves.bounce,
          curveEase: currentTheme.impulse.animation.curves.ease,
          curveSpring: currentTheme.impulse.animation.curves.spring,
          curveLinear: currentTheme.impulse.animation.curves.linear
        },
        
        // Typography
        fontFamily: {
          sans: currentTheme.impulse.typography.fonts.body,
          heading: currentTheme.impulse.typography.fonts.heading,
          mono: currentTheme.impulse.typography.fonts.monospace
        },
        
        fontSize: {
          xs: currentTheme.impulse.typography.sizes.xs,
          sm: currentTheme.impulse.typography.sizes.sm,
          base: currentTheme.impulse.typography.sizes.md,
          lg: currentTheme.impulse.typography.sizes.lg,
          xl: currentTheme.impulse.typography.sizes.xl,
          '2xl': currentTheme.impulse.typography.sizes['2xl'],
          '3xl': currentTheme.impulse.typography.sizes['3xl']
        },
        
        lineHeight: {
          tight: currentTheme.impulse.typography.lineHeights.tight,
          normal: currentTheme.impulse.typography.lineHeights.normal,
          loose: currentTheme.impulse.typography.lineHeights.loose
        },
        
        // Border radius
        radius: {
          sm: currentTheme.impulse.components.tooltip.radius,
          md: currentTheme.impulse.components.button.radius,
          lg: currentTheme.impulse.components.panel.radius,
          full: '9999px'
        }
      };
      
      // Save to database
      const { error: saveError } = await supabase
        .from('themes')
        .update({
          name: currentTheme.name,
          description: currentTheme.description,
          design_tokens: designTokens,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentTheme.id);
        
      if (saveError) {
        throw new Error(`Failed to save theme: ${saveError.message}`);
      }
      
      // Update the original theme reference
      setOriginalTheme(currentTheme);
      
      logger.info('Theme saved successfully');
    } catch (err) {
      logger.error('Error saving theme', {
        details: safeDetails(err)
      });
      
      setError(err instanceof Error ? err : new Error('Unknown error saving theme'));
      throw err;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to reset theme to original state
  const resetTheme = () => {
    if (!originalTheme) return;
    
    setCurrentTheme(originalTheme);
    applyThemeToDocument(originalTheme.impulse);
    
    logger.info('Theme reset to original state');
  };
  
  // Provide the theme context value to children
  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        isLoading,
        error,
        applyTheme,
        updateTheme,
        saveTheme,
        resetTheme,
        isDirty,
        isSaving
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
