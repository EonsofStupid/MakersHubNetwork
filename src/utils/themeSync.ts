
import { supabase } from '@/integrations/supabase/client';
import { keyframes, animation } from '@/theme/animations';
import { Json } from '@/integrations/supabase/types';

/**
 * Extracts all animations from CSS files and formats them for the database
 */
function extractAnimationsFromCSS() {
  // Get all keyframes and animations from our animations.ts file
  const keyframesObj = keyframes;
  const animationsObj = animation;
  
  // Format them for the database
  const formattedKeyframes: Record<string, any> = {};
  const formattedAnimations: Record<string, any> = {};
  
  Object.entries(keyframesObj).forEach(([name, value]) => {
    formattedKeyframes[name] = value;
  });
  
  Object.entries(animationsObj).forEach(([name, value]) => {
    formattedAnimations[name] = value;
  });
  
  return {
    keyframes: formattedKeyframes,
    animations: formattedAnimations
  };
}

/**
 * Extracts component styles for important landing page components
 */
function extractComponentStyles() {
  // Component styles for various components that need to be in the database
  return [
    {
      component_name: 'MainNav',
      styles: {
        container: {
          base: 'fixed top-0 w-full z-50 transition-all duration-300',
          animated: 'animate-morph-header shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_0_30px_rgba(0,240,255,0.1)]'
        },
        header: 'bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] border-b border-primary/30',
        logo: 'text-2xl font-bold text-cyber',
        dataStream: 'relative',
        dataStreamEffect: 'mainnav-data-stream',
        glitchParticles: 'mainnav-glitch-particles',
        nav: 'flex items-center gap-1 md:gap-2',
        navItem: 'px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group',
        navItemActive: 'text-primary',
        navItemActiveIndicator: 'absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-center',
        mobileToggle: 'block md:hidden'
      }
    },
    {
      component_name: 'Logo',
      styles: {
        container: 'relative text-2xl font-bold transition-all duration-1000 hover:translate-y-[-8px] group',
        text: 'relative z-10 flex items-center space-x-[1px]',
        letter: 'inline-block transition-all relative',
        letterActive: 'inline-block transition-all relative text-primary',
        glow: 'absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-[1500ms] rounded-full scale-150',
        hoverEffect: 'transform-gpu transition-all duration-500'
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
    const { keyframes: animationsKeyframes, animations: animationsDefs } = extractAnimationsFromCSS();
    
    // Extract component styles
    const componentStyles = extractComponentStyles();
    
    // Update design tokens with animations
    const designTokens = theme.design_tokens as Record<string, any>;
    
    const updatedDesignTokens = {
      ...designTokens,
      colors: {
        ...(designTokens?.colors || {}),
        primary: '#00F0FF',
        secondary: '#FF2D6E',
        background: '#121218',
        foreground: '#F6F6F7',
        card: '#1c1e26',
        cardForeground: '#F6F6F7',
        muted: '#1e2028',
        mutedForeground: '#a8b3cf',
        accent: '#FF2D6E',
        accentForeground: '#F6F6F7',
        destructive: '#ff4d4f',
        destructiveForeground: '#F6F6F7',
        border: 'rgba(0, 240, 255, 0.2)',
        input: '#272935',
        ring: 'rgba(0, 240, 255, 0.4)'
      },
      effects: {
        ...(designTokens?.effects || {}),
        primary: '#00F0FF',
        secondary: '#FF2D6E',
        tertiary: '#8B5CF6',
        shadows: {
          small: '0 2px 5px rgba(0, 0, 0, 0.2)',
          medium: '0 4px 10px rgba(0, 0, 0, 0.3)',
          large: '0 10px 25px rgba(0, 0, 0, 0.4)',
          glow: '0 0 15px rgba(0, 240, 255, 0.7)'
        },
        blurs: {
          slight: 'blur(4px)',
          medium: 'blur(8px)',
          heavy: 'blur(16px)'
        },
        gradients: {
          primary: 'linear-gradient(90deg, #00F0FF, #0080FF)',
          secondary: 'linear-gradient(90deg, #FF2D6E, #FFA07A)',
          accent: 'linear-gradient(90deg, #8B5CF6, #D946EF)'
        }
      },
      animation: {
        ...(designTokens?.animation || {}),
        keyframes: animationsKeyframes,
        transitions: animationsDefs || {},
        durations: {
          ...(designTokens?.animation?.durations || {}),
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
          animationFast: '1s',
          animationNormal: '2s',
          animationSlow: '3s'
        }
      },
      typography: {
        ...(designTokens?.typography || {}),
        fontFamilies: {
          heading: 'Space Grotesk, sans-serif',
          body: 'Inter, sans-serif',
          mono: 'monospace'
        },
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem',
          '6xl': '3.75rem',
          '7xl': '4.5rem',
          '8xl': '6rem',
          '9xl': '8rem'
        }
      },
      spacing: {
        ...(designTokens?.spacing || {}),
        radius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          full: '9999px'
        }
      }
    };
    
    // Update the theme with the new design tokens
    const { error: updateError } = await supabase
      .from('themes')
      .update({
        design_tokens: updatedDesignTokens as Json,
        name: 'Impulsivity',
        description: 'A cyberpunk-inspired theme with neon effects and vivid colors',
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

/**
 * Sync the Impulsivity theme to the database
 */
export async function syncImpulsivityTheme(): Promise<boolean> {
  try {
    // First check if the Impulsivity theme exists
    const { data: existingThemes, error: queryError } = await supabase
      .from('themes')
      .select('id')
      .eq('name', 'Impulsivity');
      
    if (queryError) throw queryError;
    
    let themeId: string;
    
    if (existingThemes && existingThemes.length > 0) {
      // Update existing theme
      themeId = existingThemes[0].id;
    } else {
      // Create new theme
      const { data: newTheme, error: createError } = await supabase
        .from('themes')
        .insert({
          name: 'Impulsivity',
          description: 'A cyberpunk-inspired theme with neon effects and vivid colors',
          is_public: true,
          design_tokens: {
            colors: {
              primary: '#00F0FF',
              secondary: '#FF2D6E'
            }
          } as Json
        })
        .select('id')
        .single();
        
      if (createError) throw createError;
      if (!newTheme) throw new Error('Failed to create new theme');
      
      themeId = newTheme.id;
    }
    
    // Sync CSS to the database
    return await syncCSSToDatabase(themeId);
  } catch (error) {
    console.error('Error syncing Impulsivity theme:', error);
    return false;
  }
}
