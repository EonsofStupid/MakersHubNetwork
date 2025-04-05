
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { Theme, ComponentTokens } from '@/types/theme';

/**
 * Safely validate a hex color string
 * @param color String to validate as a hex color
 * @returns boolean - true if valid hex color
 */
export function isValidHexColor(color: unknown): boolean {
  if (typeof color !== 'string') {
    return false;
  }
  
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}

/**
 * Convert hex color to RGB values
 * @param hex Valid hex color string
 * @returns RGB object or null if invalid
 */
export function hexToRGB(hex: string): { r: number; g: number; b: number } | null {
  if (!isValidHexColor(hex)) {
    console.warn('[Theme] Invalid hex color in hexToRGB:', hex);
    return null;
  }
  
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  let fullHex = hex.replace(/^#/, '');
  if (fullHex.length === 3) {
    fullHex = fullHex[0] + fullHex[0] + fullHex[1] + fullHex[1] + fullHex[2] + fullHex[2];
  }

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Safely access a nested property from an object with a fallback value
 */
export function safelyGetNestedValue<T>(obj: Record<string, any> | undefined | null, path: string[], fallback: T): T {
  if (!obj) return fallback;
  
  let current = obj;
  
  for (const key of path) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return fallback;
    }
    current = current[key];
  }
  
  return (current === undefined || current === null) ? fallback : current as T;
}

/**
 * Sync CSS styles to the database for a given theme
 */
export async function syncCSSToDatabase(themeId: string): Promise<boolean> {
  try {
    console.log('Syncing CSS to database for theme:', themeId);
    
    // Get the current theme
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .single();
      
    if (themeError) throw themeError;
    if (!theme) throw new Error('Theme not found');
    
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
      }
    };
    
    // Extract component styles
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
      })
      .eq('id', themeId);
      
    if (updateError) throw updateError;
    
    // Update component tokens
    for (const component of componentStyles) {
      // Check if component already exists
      const { data: existingComponents, error: compError } = await supabase
        .from('theme_components')
        .select('id')
        .eq('theme_id', themeId)
        .eq('component_name', component.component_name);
        
      if (compError) throw compError;
      
      if (existingComponents && existingComponents.length > 0) {
        // Update existing component
        const { error: updateCompError } = await supabase
          .from('theme_components')
          .update({
            styles: component.styles as Json
          })
          .eq('id', existingComponents[0].id);
          
        if (updateCompError) throw updateCompError;
      } else {
        // Insert new component
        const { error: insertCompError } = await supabase
          .from('theme_components')
          .insert({
            theme_id: themeId,
            component_name: component.component_name,
            styles: component.styles as Json
          });
          
        if (insertCompError) throw insertCompError;
      }
    }
    
    console.log('CSS successfully synced to database');
    return true;
  } catch (error) {
    console.error('Error syncing CSS to database:', error);
    return false;
  }
}
