
import { supabase } from '@/integrations/supabase/client';
import { keyframes, animation } from '@/theme/animations';
import { Json } from '@/integrations/supabase/types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { ThemeContext, ThemeLogDetails } from '@/types/theme';
import { PostgrestError } from '@supabase/supabase-js';

// Create a logger instance - use regular function not hook
const logger = getLogger();

/**
 * Convert PostgrestError to a proper ThemeLogDetails object
 */
function formatPostgrestError(error: PostgrestError): ThemeLogDetails {
  return {
    error: true,
    errorMessage: error.message,
    errorCode: error.code,
    errorDetails: error.details,
    errorHint: error.hint
  };
}

/**
 * Safely update design tokens with new values
 */
function safeUpdateDesignTokens(existingTokens: Record<string, any> = {}, newValues: Record<string, any> = {}): Record<string, any> {
  return {
    ...existingTokens,
    ...newValues,
  };
}

/**
 * Extracts all animations from CSS files and formats them for the database
 */
function extractAnimationsFromCSS(): { keyframes: Record<string, any>, animations: Record<string, any> } {
  // Get all keyframes and animations from our animations.ts file
  const keyframesObj = keyframes;
  const animationsObj = animation;
  
  // Format them for the database
  const formattedKeyframes: Record<string, any> = {};
  const formattedAnimations: Record<string, any> = {};
  
  try {
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
  } catch (error) {
    const errorDetails: ThemeLogDetails = { 
      error: true,
      errorMessage: error instanceof Error ? error.message : String(error)
    };
    logger.error('Error extracting animations', errorDetails);
    return {
      keyframes: {},
      animations: {}
    };
  }
}

/**
 * Extracts component styles for important landing page components
 */
function extractComponentStyles(): Array<{
  component_name: string;
  styles: Record<string, any>;
  description?: string;
  context: ThemeContext;
}> {
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
      },
      context: 'site'
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
      },
      context: 'site'
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
      },
      context: 'site'
    },
    {
      component_name: 'AdminNav',
      styles: {
        container: 'fixed top-0 left-0 w-64 h-screen bg-background/90 border-r border-primary/20 backdrop-blur-md z-50 transition-all duration-300',
        header: 'h-16 flex items-center justify-between px-4 border-b border-primary/20',
        logo: 'text-xl font-bold text-primary',
        navSection: 'py-4 px-2',
        navTitle: 'text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2',
        navItem: 'flex items-center gap-3 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 my-1 transition-colors',
        navItemActive: 'text-primary bg-primary/10 font-medium',
        iconWrapper: 'flex items-center justify-center w-5 h-5',
        collapsedContainer: 'w-16',
        collapsedNavItem: 'flex items-center justify-center'
      },
      context: 'admin'
    }
  ];
}

/**
 * Sync CSS styles to the database for a given theme
 */
export async function syncCSSToDatabase(themeId: string): Promise<boolean> {
  try {
    const logDetails: ThemeLogDetails = { themeId };
    logger.info('Syncing CSS to database for theme', logDetails);
    
    // Get the current theme
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .single();
      
    if (themeError) {
      logger.error('Error fetching theme', formatPostgrestError(themeError));
      throw themeError;
    }
    
    if (!theme) {
      const notFoundDetails: ThemeLogDetails = { 
        error: true,
        reason: 'Theme not found',
        themeId
      };
      logger.error('Theme not found', notFoundDetails);
      throw new Error('Theme not found');
    }
    
    // Extract animations from CSS files
    const { keyframes: animationsKeyframes, animations: animationsDefs } = extractAnimationsFromCSS();
    
    // Extract component styles
    const componentStyles = extractComponentStyles();
    
    // Update design tokens with animations
    const designTokens = theme.design_tokens as Record<string, any> || {};
    
    const updatedDesignTokens = safeUpdateDesignTokens(designTokens, {
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
    });
    
    // Update the theme with the new design tokens
    const { error: updateError } = await supabase
      .from('themes')
      .update({
        design_tokens: updatedDesignTokens as Json,
        name: 'Impulsivity',
        description: 'A cyberpunk-inspired theme with neon effects and vivid colors',
      })
      .eq('id', themeId);
      
    if (updateError) {
      logger.error('Error updating theme design tokens', formatPostgrestError(updateError));
      throw updateError;
    }
    
    const updateDetails: ThemeLogDetails = { 
      success: true,
      themeId
    };
    logger.info('Updated theme design tokens successfully', updateDetails);
    
    // Update component tokens
    for (const component of componentStyles) {
      try {
        // Check if component already exists
        const { data: existingComponents, error: compError } = await supabase
          .from('theme_components')
          .select('id')
          .eq('theme_id', themeId)
          .eq('component_name', component.component_name);
          
        if (compError) {
          const componentErrorDetails: ThemeLogDetails = {
            error: true,
            component: component.component_name,
            errorMessage: compError.message 
          };
          logger.error('Error checking theme component existence', componentErrorDetails);
          throw compError;
        }
        
        if (existingComponents && existingComponents.length > 0) {
          // Update existing component
          const { error: updateCompError } = await supabase
            .from('theme_components')
            .update({
              styles: component.styles as Json,
              context: component.context
            })
            .eq('id', existingComponents[0].id);
            
          if (updateCompError) {
            const componentUpdateErrorDetails: ThemeLogDetails = {
              error: true,
              component: component.component_name,
              errorMessage: updateCompError.message
            };
            logger.error('Error updating theme component', componentUpdateErrorDetails);
            throw updateCompError;
          }
          
          const componentUpdateDetails: ThemeLogDetails = { 
            success: true,
            component: component.component_name 
          };
          logger.info('Updated theme component', componentUpdateDetails);
        } else {
          // Insert new component
          const { error: insertCompError } = await supabase
            .from('theme_components')
            .insert({
              theme_id: themeId,
              component_name: component.component_name,
              styles: component.styles as Json,
              context: component.context
            });
            
          if (insertCompError) {
            const componentInsertErrorDetails: ThemeLogDetails = {
              error: true,
              component: component.component_name,
              errorMessage: insertCompError.message
            };
            logger.error('Error inserting theme component', componentInsertErrorDetails);
            throw insertCompError;
          }
          
          const componentInsertDetails: ThemeLogDetails = { 
            success: true,
            component: component.component_name 
          };
          logger.info('Inserted new theme component', componentInsertDetails);
        }
      } catch (componentError) {
        // Log error but continue with other components
        const componentErrorDetails: ThemeLogDetails = {
          error: true,
          component: component.component_name,
          errorMessage: componentError instanceof Error ? componentError.message : String(componentError)
        };
        logger.error('Error processing theme component', componentErrorDetails);
      }
    }
    
    const syncSuccessDetails: ThemeLogDetails = { 
      success: true,
      themeId
    };
    logger.info('CSS successfully synced to database', syncSuccessDetails);
    return true;
  } catch (error) {
    const syncErrorDetails: ThemeLogDetails = {
      error: true,
      errorMessage: error instanceof Error ? error.message : String(error)
    };
    logger.error('Error syncing CSS to database', syncErrorDetails);
    return false;
  }
}

/**
 * Ensure Impulsivity theme exists or create it
 */
async function ensureImpulsivityTheme(): Promise<string | null> {
  try {
    logger.info('Ensuring Impulsivity theme exists');
    
    // First check if the Impulsivity theme exists
    const { data: existingThemes, error: queryError } = await supabase
      .from('themes')
      .select('id')
      .eq('name', 'Impulsivity');
      
    if (queryError) {
      const queryErrorDetails = formatPostgrestError(queryError);
      logger.error('Error checking theme existence', queryErrorDetails);
      throw queryError;
    }
    
    let themeId: string;
    
    if (existingThemes && existingThemes.length > 0) {
      // Use existing theme
      themeId = existingThemes[0].id;
      const existingThemeDetails: ThemeLogDetails = { 
        success: true,
        themeId 
      };
      logger.info('Found existing Impulsivity theme', existingThemeDetails);
    } else {
      // Create new theme with required structure
      const { data: newTheme, error: createError } = await supabase
        .from('themes')
        .insert({
          name: 'Impulsivity',
          description: 'A cyberpunk-inspired theme with neon effects and vivid colors',
          status: 'published',
          is_default: true,
          is_public: true,
          version: 1,
          context: 'site' as ThemeContext,
          design_tokens: {
            colors: {
              primary: '#00F0FF',
              secondary: '#FF2D6E'
            },
            effects: {
              shadows: {},
              blurs: {},
              gradients: {},
              primary: '#00F0FF',
              secondary: '#FF2D6E',
              tertiary: '#8B5CF6'
            }
          } as Json,
          component_tokens: [] as Json
        })
        .select('id')
        .single();
        
      if (createError) {
        const createErrorDetails: ThemeLogDetails = formatPostgrestError(createError);
        logger.error('Failed to create Impulsivity theme', createErrorDetails);
        throw createError;
      }
      
      if (!newTheme) {
        const noDataErrorDetails: ThemeLogDetails = { 
          error: true,
          errorMessage: 'No data returned' 
        };
        logger.error('Failed to create new theme - no data returned', noDataErrorDetails);
        throw new Error('Failed to create new theme');
      }
      
      themeId = newTheme.id;
      const newThemeDetails: ThemeLogDetails = { themeId };
      logger.info('Created new Impulsivity theme', newThemeDetails);
    }
    
    return themeId;
  } catch (error) {
    const errorDetails: ThemeLogDetails = {
      error: true,
      errorMessage: error instanceof Error ? error.message : String(error)
    };
    logger.error('Error ensuring Impulsivity theme', errorDetails);
    return null;
  }
}

/**
 * Synchronize the Impulsivity theme to the database
 */
export async function syncImpulsivityTheme(): Promise<boolean> {
  try {
    // First ensure the theme exists
    const themeId = await ensureImpulsivityTheme();
    
    if (!themeId) {
      throw new Error('Failed to get or create Impulsivity theme');
    }
    
    // Then sync the CSS styles
    return await syncCSSToDatabase(themeId);
  } catch (error) {
    const syncErrorDetails: ThemeLogDetails = {
      error: true,
      errorMessage: error instanceof Error ? error.message : String(error)
    };
    logger.error('Error syncing Impulsivity theme', syncErrorDetails);
    return false;
  }
}
