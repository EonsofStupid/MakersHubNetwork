
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { Theme, ComponentTokens } from '@/types/theme';
import { DEFAULT_THEME_NAME } from './themeInitializer';
import { getLogger } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeUtils');

/**
 * Deep merge utility for objects
 * Used to combine default and custom theme settings
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue && 
      targetValue && 
      typeof sourceValue === 'object' && 
      typeof targetValue === 'object' && 
      !Array.isArray(sourceValue) && 
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  });

  return result;
}

/**
 * Sync CSS styles to the database for a given theme
 * This function is crucial for the visual theme editor
 */
export async function syncCSSToDatabase(themeId: string): Promise<boolean> {
  try {
    logger.info('Syncing CSS to database for theme', { details: { themeId } });
    
    // Get the current theme
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .single();
      
    if (themeError) {
      logger.error('Error getting theme', { details: safeDetails(themeError) });
      throw themeError;
    }
    
    if (!theme) {
      logger.error('Theme not found');
      throw new Error('Theme not found');
    }
    
    // Extract animations from CSS files
    const animationsKeyframes = {
      'fade-in': {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' }
      },
      'fade-out': {
        '0%': { opacity: '1', transform: 'translateY(0)' },
        '100%': { opacity: '0', transform: 'translateY(10px)' }
      },
      'scale-in': {
        '0%': { transform: 'scale(0.95)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' }
      },
      'float': {
        '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
        '50%': { transform: 'translateY(-20px) rotate(5deg)' }
      },
      'pulse': {
        '0%': { opacity: '0.4' },
        '50%': { opacity: '0.1' },
        '100%': { opacity: '0.4' }
      },
      'morph-header': {
        '0%': { 
          'clip-path': 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' 
        },
        '50%': { 
          'clip-path': 'polygon(0% 0%, 100% 0%, 100% 80%, 85% 80%, 85% 100%, 60% 80%, 0% 80%)' 
        },
        '100%': { 
          'clip-path': 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' 
        }
      },
      'data-stream': {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(-50%)' }
      }
    };
    
    // Extract component styles for the Impulsivity theme
    const componentStyles = [
      {
        component_name: 'MainNav',
        styles: {
          container: {
            base: 'fixed top-0 w-full z-50 transition-all duration-300',
            animated: 'animate-morph-header shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_0_30px_rgba(0,240,255,0.1)]'
          },
          header: 'bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] border-b border-primary/30',
          logo: 'text-xl font-bold text-primary hover:text-primary/80 transition-colors duration-300',
          nav: 'flex items-center gap-1 md:gap-2',
          navItem: 'px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors',
          navItemActive: 'text-primary',
          mobileToggle: 'block md:hidden'
        }
      },
      {
        component_name: 'Footer',
        styles: {
          container: 'fixed bottom-0 left-0 right-0 w-full z-40 transition-all ease-in-out',
          base: 'bg-background/20 backdrop-blur-xl shadow-[0_-8px_32px_0_rgba(0,240,255,0.2)] border-t border-primary/30',
          transform: 'transform perspective(1000px) rotateX(1deg) clip-path polygon(0 100%, 100% 100%, 98% 0%, 2% 0%)',
          content: 'container mx-auto px-4 py-4',
          linksSection: 'grid grid-cols-2 md:grid-cols-4 gap-8',
          linkGroup: 'space-y-2',
          linkGroupTitle: 'text-sm font-semibold text-primary',
          linkItem: 'text-xs text-muted-foreground hover:text-primary transition-colors duration-200',
          copyrightSection: 'mt-8 pt-4 border-t border-primary/20 text-xs text-muted-foreground',
          socialIcons: 'flex mt-2 space-x-4'
        }
      },
      {
        component_name: 'Card',
        styles: {
          base: 'bg-card/80 backdrop-blur-md border border-border/50 rounded-lg overflow-hidden transition-all duration-300',
          hoverEffect: 'hover:border-primary/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]',
          header: 'p-4 border-b border-border/30',
          title: 'text-lg font-medium text-primary',
          content: 'p-4',
          footer: 'p-4 border-t border-border/30 bg-muted/30'
        }
      },
      {
        component_name: 'Button',
        styles: {
          base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
          primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
          glow: 'hover:shadow-[0_0_10px_rgba(0,240,255,0.5)]'
        }
      }
    ];
    
    // Update design tokens with animations
    const designTokens = theme.design_tokens as Record<string, any>;
    
    const updatedDesignTokens = {
      ...designTokens,
      animation: {
        ...(designTokens?.animation || {}),
        keyframes: animationsKeyframes,
        transitions: designTokens?.animation?.transitions || {},
        durations: {
          ...(designTokens?.animation?.durations || {}),
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
          animationFast: '1s',
          animationNormal: '2s',
          animationSlow: '3s'
        }
      }
    };
    
    // Update the theme with the new design tokens
    const { error: updateError } = await supabase
      .from('themes')
      .update({
        design_tokens: updatedDesignTokens as Json,
        name: DEFAULT_THEME_NAME // Ensure name is correct
      })
      .eq('id', themeId);
      
    if (updateError) {
      logger.error('Error updating theme', { details: safeDetails(updateError) });
      throw updateError;
    }
    
    // Update component tokens
    for (const component of componentStyles) {
      // Check if component already exists
      const { data: existingComponents, error: compError } = await supabase
        .from('theme_components')
        .select('id')
        .eq('theme_id', themeId)
        .eq('component_name', component.component_name);
        
      if (compError) {
        logger.error('Error checking for existing component', { 
          details: safeDetails(compError) 
        });
        throw compError;
      }
      
      if (existingComponents && existingComponents.length > 0) {
        // Update existing component
        const { error: updateCompError } = await supabase
          .from('theme_components')
          .update({
            styles: component.styles as Json
          })
          .eq('id', existingComponents[0].id);
          
        if (updateCompError) {
          logger.error('Error updating component', { 
            details: safeDetails(updateCompError) 
          });
          throw updateCompError;
        }
      } else {
        // Insert new component
        const { error: insertCompError } = await supabase
          .from('theme_components')
          .insert({
            theme_id: themeId,
            component_name: component.component_name,
            styles: component.styles as Json
          });
          
        if (insertCompError) {
          logger.error('Error inserting component', { 
            details: safeDetails(insertCompError) 
          });
          throw insertCompError;
        }
      }
    }
    
    logger.info('CSS successfully synced to database');
    return true;
  } catch (error) {
    logger.error('Error syncing CSS to database', { details: safeDetails(error) });
    return false;
  }
}

/**
 * Get the CSS variable name for a theme property
 * Used by the visual theme editor
 */
export function getCSSVariableName(path: string): string {
  const parts = path.split('.');
  return `--${parts.join('-')}`;
}

/**
 * Convert a theme property path to a readable label
 * Used by the visual theme editor
 */
export function getReadableLabel(path: string): string {
  const parts = path.split('.');
  const label = parts[parts.length - 1]
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase();
  
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Get a theme property by path
 * Used by the visual theme editor
 */
export function getThemeProperty(theme: any, path: string): any {
  const parts = path.split('.');
  let result = theme;
  
  for (const part of parts) {
    if (result === undefined || result === null) return undefined;
    result = result[part];
  }
  
  return result;
}
