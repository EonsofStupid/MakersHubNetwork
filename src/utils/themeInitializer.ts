import { supabase } from '@/integrations/supabase/client';
import { Theme, ComponentTokens } from '@/types/theme';
import { Json } from '@/integrations/supabase/types';
import { keyframes } from '@/theme/animations';
import { generateUUID, isValidUUID } from '@/logging/utils/type-guards';
import { getLogger } from '@/logging';

const logger = getLogger('ThemeInitializer');

/**
 * Ensures that a default theme exists in the database
 * If no default theme exists, creates one
 * Returns the theme ID regardless of authenticated state
 */
export async function ensureDefaultTheme(): Promise<string | null> {
  try {
    logger.info('Ensuring default theme exists');
    
    // Check if a default theme already exists
    const { data: existingTheme, error } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') {
        // Only log if it's not the "no rows returned" error
        logger.error('Error checking for default theme:', { details: { error } });
      } else {
        logger.debug('No default theme found, will create one');
      }
    }
    
    // If a default theme exists, return its ID
    if (existingTheme && existingTheme.id) {
      // Validate the UUID before returning
      if (isValidUUID(existingTheme.id)) {
        logger.info('Found existing default theme', { details: { id: existingTheme.id } });
        
        // Sync CSS to this theme
        try {
          const syncResult = await syncCSSToDatabase(existingTheme.id);
          logger.debug('Sync result for existing theme:', { details: { syncResult, themeId: existingTheme.id } });
        } catch (syncError) {
          logger.error('Error syncing CSS for existing theme:', { details: { syncError, themeId: existingTheme.id } });
          // Continue despite sync error - theme ID is still valid
        }
        
        return existingTheme.id;
      } else {
        logger.error('Found default theme but ID is invalid:', { details: { id: existingTheme.id } });
        // Continue to create a new theme
      }
    }
    
    // Otherwise, create a default theme
    logger.info('Creating new default theme');
    const defaultTheme = {
      name: 'Default Theme',
      description: 'The default system theme',
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
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          tertiary: '#8B5CF6',
        },
        animation: {
          keyframes: keyframes,
          durations: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
            animationFast: '1s',
            animationNormal: '2s',
            animationSlow: '3s',
          }
        },
        spacing: {
          radius: {
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem',
            full: '9999px',
          }
        }
      },
      component_tokens: [],
      composition_rules: {},
      cached_styles: {}
    };
    
    // Try to insert the default theme
    try {
      // Insert the default theme
      const { data, error: insertError } = await supabase
        .from('themes')
        .insert(defaultTheme as any)
        .select()
        .single();
      
      if (insertError) {
        logger.error('Error creating default theme:', { details: { error: insertError } });
        // Return null when we can't create a theme - app will use fallback
        return null;
      }
      
      if (!data || !data.id) {
        logger.error('No data returned after inserting default theme');
        return null;
      }
      
      logger.info('Created default theme with ID:', { details: { id: data.id } });
      
      // Validate the new theme ID
      if (!isValidUUID(data.id)) {
        logger.error('Created theme but ID is invalid:', { details: { id: data.id } });
        return null;
      }
      
      // Sync CSS to the new theme
      try {
        const syncResult = await syncCSSToDatabase(data.id);
        logger.debug('Sync result for new theme:', { details: { syncResult, themeId: data.id } });
      } catch (syncError) {
        logger.error('Error syncing CSS for new theme:', { details: { syncError, themeId: data.id } });
        // Continue despite sync error - theme ID is still valid
      }
      
      return data.id;
    } catch (insertError) {
      logger.error('Failed to insert default theme', { details: { error: insertError } });
      
      // Attempt to get the default theme ID as a fallback
      try {
        const { data: fallbackTheme } = await supabase
          .from('themes')
          .select('id')
          .eq('is_default', true)
          .single();
          
        if (fallbackTheme?.id && isValidUUID(fallbackTheme.id)) {
          logger.info('Found existing default theme as fallback', { details: { id: fallbackTheme.id } });
          return fallbackTheme.id;
        }
      } catch (fallbackError) {
        logger.error('Error finding fallback theme', { details: { error: fallbackError } });
      }
      
      return null;
    }
  } catch (error) {
    logger.error('Unexpected error in ensureDefaultTheme:', { details: { error } });
    return null;
  }
}

/**
 * Sync all CSS to the database for the given theme ID
 */
export async function syncCSSToDatabase(themeId: string): Promise<boolean> {
  try {
    logger.info('Syncing CSS to database for theme:', { details: { themeId } });
    
    // Validate UUID before proceeding
    if (!isValidUUID(themeId)) {
      logger.error('Invalid theme ID provided to syncCSSToDatabase:', { details: { themeId } });
      return false;
    }
    
    // Get the current theme
    const { data: theme, error: themeError } = await supabase
      .from("themes")
      .select("*")
      .eq("id", themeId)
      .single();
      
    if (themeError) {
      logger.error('Database error fetching theme:', { details: { error: themeError, themeId } });
      throw themeError;
    }
    
    if (!theme) {
      logger.error('Theme not found for ID:', { details: { themeId } });
      throw new Error('Theme not found');
    }
    
    // Define our component styles
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
          mobileToggle: 'block md:hidden',
          dataStream: 'relative',
          dataStreamEffect: `
            before:content-[''] before:absolute before:inset-0 before:w-screen before:bg-repeat-x before:opacity-30 
            before:transition-opacity before:duration-300 before:bg-gradient-to-r
            before:from-transparent before:via-primary/50 before:to-transparent
            before:animate-data-stream before:left-1/2 before:-translate-x-1/2
          `,
          glitchParticles: `
            before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:w-screen
            before:left-1/2 before:-translate-x-1/2 before:opacity-50 before:animate-particles-1
            after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:w-screen
            after:left-1/2 after:-translate-x-1/2 after:opacity-30 after:animate-particles-2
          `,
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
        component_name: 'SimpleCyberText',
        styles: {
          base: 'relative inline-block',
          primary: 'absolute -top-[2px] left-[2px] text-primary/40 z-10 skew-x-6',
          secondary: 'absolute -bottom-[2px] left-[-2px] text-secondary/40 z-10 skew-x-[-6deg]'
        }
      },
      {
        component_name: 'ThemeDataStream',
        styles: {
          container: 'absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none',
          streamVertical: 'animate-stream-vertical absolute h-[50vh] w-[2px] bg-gradient-to-b from-transparent via-primary/20 to-transparent',
          streamHorizontal: 'animate-stream-horizontal absolute h-[2px] w-[50vw] bg-gradient-to-r from-transparent via-secondary/20 to-transparent'
        }
      },
      {
        component_name: 'ActionButtons',
        styles: {
          buildCta: "cyber-card inline-flex h-12 items-center justify-center rounded-md bg-primary/20 px-8 text-sm font-medium text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 hover:scale-105 hover:bg-primary/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden",
          browseCta: "glass-morphism inline-flex h-12 items-center justify-center rounded-md border border-primary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent/10 hover:text-accent-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden",
          communityCta: "neo-blur inline-flex h-12 items-center justify-center rounded-md border border-secondary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium transition-colors hover:bg-secondary/10 hover:text-secondary-foreground hover:border-secondary/50 hover:shadow-[0_0_15px_rgba(255,45,110,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden"
        }
      },
      {
        component_name: 'PageTitle',
        styles: {
          title: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative",
          gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mad-scientist-hover"
        }
      },
      {
        component_name: 'SubscriptionForm',
        styles: {
          container: "subscribe-banner cyber-card p-4 md:p-6 max-w-xl mx-auto my-8 relative overflow-hidden",
          gradient: "absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10"
        }
      },
      {
        component_name: 'FeaturesSection',
        styles: {
          container: "py-16 bg-background/30 backdrop-blur-sm relative",
          title: "text-3xl font-bold text-center mb-12",
          grid: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4",
          feature: "feature-cta",
          featureTitle: "feature-cta-title",
          featureDescription: "feature-cta-description", 
          featureButton: "feature-cta-button",
          featureHoverEffect: "feature-cta-hover-effect"
        }
      },
      {
        component_name: 'BuildShowcase',
        styles: {
          container: "showcase-section py-16 relative",
          title: "text-3xl font-bold text-center mb-12",
          grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4",
          card: "build-card",
          cardImageContainer: "build-card-image-container",
          cardImage: "build-card-image",
          cardGradientOverlay: "build-card-gradient-overlay",
          cardCategory: "build-card-category",
          cardContent: "build-card-content",
          cardTitle: "build-card-title",
          cardCreator: "build-card-creator",
          cardStats: "build-card-stats"
        }
      }
    ];
    
    // Use our animations
    const animationsKeyframes = keyframes;
    
    // Prepare the design tokens update 
    // Start with existing design tokens or an empty object
    const currentDesignTokens = theme.design_tokens && typeof theme.design_tokens === 'object' 
      ? theme.design_tokens as Record<string, any>
      : {};
    
    // Add our animations
    const updatedDesignTokens = {
      ...currentDesignTokens,
      animation: {
        ...(currentDesignTokens.animation || {}),
        keyframes: animationsKeyframes,
        transitions: currentDesignTokens.animation?.transitions || {},
        durations: {
          ...(currentDesignTokens.animation?.durations || {}),
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
    try {
      const { error: updateError } = await supabase
        .from('themes')
        .update({
          design_tokens: updatedDesignTokens as Json,
        })
        .eq('id', themeId);
        
      if (updateError) {
        logger.error('Error updating theme design tokens:', { details: { error: updateError, themeId } });
        throw updateError;
      }
    } catch (updateError) {
      logger.error('Failed to update theme design tokens:', { details: { error: updateError, themeId } });
      // Continue with component updates even if token update fails
    }
    
    // Process component tokens with better error handling
    for (const component of componentStyles) {
      try {
        // Generate a new valid UUID for component
        const componentId = generateUUID();
        
        // Check if component already exists
        const { data: existingComponents, error: compError } = await supabase
          .from('theme_components')
          .select('id')
          .eq('theme_id', themeId)
          .eq('component_name', component.component_name);
          
        if (compError) {
          logger.error('Error fetching existing component:', { 
            details: { error: compError, componentName: component.component_name } 
          });
          // Continue with next component
          continue;
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
            logger.error('Error updating component:', { 
              details: { error: updateCompError, componentId: existingComponents[0].id } 
            });
            // Continue with next component
            continue;
          }
          
          logger.debug(`Updated component ${component.component_name}`);
        } else {
          // Insert new component
          const { error: insertCompError } = await supabase
            .from('theme_components')
            .insert({
              id: componentId,
              theme_id: themeId,
              component_name: component.component_name,
              styles: component.styles as Json
            });
            
          if (insertCompError) {
            logger.error('Error inserting component:', { 
              details: { error: insertCompError, componentName: component.component_name } 
            });
            // Continue with next component
            continue;
          }
          
          logger.debug(`Inserted component ${component.component_name}`);
        }
      } catch (componentError) {
        logger.error('Unexpected error processing component:', { 
          details: { error: componentError, componentName: component.component_name } 
        });
        // Continue with next component
        continue;
      }
    }
    
    logger.info('CSS successfully synced to database', { details: { themeId } });
    return true;
  } catch (error) {
    logger.error('Error syncing CSS to database:', { details: { error, themeId } });
    return false;
  }
}
