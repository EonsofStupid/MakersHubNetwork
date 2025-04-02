import { supabase } from '@/integrations/supabase/client';
import { Theme, ComponentTokens } from '@/types/theme';
import { Json } from '@/integrations/supabase/types';
import { keyframes } from '@/theme/animations';
import { generateUUID, isValidUUID } from '@/logging/utils/type-guards';

/**
 * Ensures that a default theme exists in the database
 * If no default theme exists, creates one
 */
export async function ensureDefaultTheme(): Promise<string | null> {
  try {
    // Check if a default theme already exists
    const { data: existingTheme, error } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking for default theme:', error);
      return null;
    }
    
    // If a default theme exists, return its ID
    if (existingTheme) {
      // Validate the UUID before returning
      if (isValidUUID(existingTheme.id)) {
        // Automatically sync CSS to this theme
        await syncCSSToDatabase(existingTheme.id);
        return existingTheme.id;
      } else {
        console.error('Found default theme but ID is invalid:', existingTheme.id);
        return null;
      }
    }
    
    // Otherwise, create a default theme
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
    
    // Insert the default theme
    const { data, error: insertError } = await supabase
      .from('themes')
      .insert(defaultTheme as any)
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating default theme:', insertError);
      return null;
    }
    
    // Sync CSS to the new theme
    if (data && data.id) {
      await syncCSSToDatabase(data.id);
    }
    
    console.log('Created default theme with ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Unexpected error in ensureDefaultTheme:', error);
    return null;
  }
}

/**
 * Sync all CSS to the database for the given theme ID
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
    
    // Use our predefined keyframes
    const animationsKeyframes = keyframes;
    
    // Extract component styles with explicit ids
    const componentStyles = [
      {
        id: generateUUID(),
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
        id: generateUUID(),
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
        id: generateUUID(),
        component_name: 'SimpleCyberText',
        styles: {
          base: 'relative inline-block',
          primary: 'absolute -top-[2px] left-[2px] text-primary/40 z-10 skew-x-6',
          secondary: 'absolute -bottom-[2px] left-[-2px] text-secondary/40 z-10 skew-x-[-6deg]'
        }
      },
      {
        id: generateUUID(),
        component_name: 'ThemeDataStream',
        styles: {
          container: 'absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none',
          streamVertical: 'animate-stream-vertical absolute h-[50vh] w-[2px] bg-gradient-to-b from-transparent via-primary/20 to-transparent',
          streamHorizontal: 'animate-stream-horizontal absolute h-[2px] w-[50vw] bg-gradient-to-r from-transparent via-secondary/20 to-transparent'
        }
      },
      {
        id: generateUUID(),
        component_name: 'ActionButtons',
        styles: {
          buildCta: "cyber-card inline-flex h-12 items-center justify-center rounded-md bg-primary/20 px-8 text-sm font-medium text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 hover:scale-105 hover:bg-primary/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden",
          browseCta: "glass-morphism inline-flex h-12 items-center justify-center rounded-md border border-primary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent/10 hover:text-accent-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden",
          communityCta: "neo-blur inline-flex h-12 items-center justify-center rounded-md border border-secondary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium transition-colors hover:bg-secondary/10 hover:text-secondary-foreground hover:border-secondary/50 hover:shadow-[0_0_15px_rgba(255,45,110,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden"
        }
      },
      {
        id: generateUUID(),
        component_name: 'PageTitle',
        styles: {
          title: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative",
          gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mad-scientist-hover"
        }
      },
      {
        id: generateUUID(),
        component_name: 'SubscriptionForm',
        styles: {
          container: "subscribe-banner cyber-card p-4 md:p-6 max-w-xl mx-auto my-8 relative overflow-hidden",
          gradient: "absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10"
        }
      },
      {
        id: generateUUID(),
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
        id: generateUUID(),
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
            id: component.id,
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
