
import { supabase } from '@/integrations/supabase/client';
import { Theme, ComponentTokens } from '@/types/theme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

const logger = getLogger('ThemeSync', LogCategory.SYSTEM);

export async function syncImpulsivityTheme() {
  try {
    logger.info('Starting Impulsivity theme sync');

    // Fetch the current theme from the database
    const { data: currentTheme, error: getThemeError } = await supabase
      .from('themes')
      .select('*')
      .eq('name', 'Impulsivity')
      .single();

    if (getThemeError) {
      logger.error('Error fetching current theme', { error: getThemeError });
      throw getThemeError;
    }

    if (!currentTheme) {
      logger.warn('No Impulsivity theme found in database');
      return false;
    }

    // Define the base Impulsivity theme
    const baseImpulsivityTheme: Partial<Theme> = {
      id: currentTheme.id,
      name: 'Impulsivity',
      description: 'Base Impulsivity theme',
      status: 'published',
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      design_tokens: {
        colors: {
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          background: '#080F1E',
          foreground: '#F9FAFB',
          card: '#0E172A',
          cardForeground: '#F9FAFB',
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
          keyframes: {},
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
      composition_rules: {},
      cached_styles: {},
    };

    // Check if the theme needs to be updated
    let themeNeedsUpdate = false;
    const updatedTheme = { ...baseImpulsivityTheme };

    // Compare design tokens
    if (JSON.stringify(currentTheme.design_tokens) !== JSON.stringify(baseImpulsivityTheme.design_tokens)) {
      updatedTheme.design_tokens = baseImpulsivityTheme.design_tokens;
      themeNeedsUpdate = true;
    }

    // Update the theme if needed
    if (themeNeedsUpdate) {
      try {
        const { error: updateThemeError } = await supabase
          .from('themes')
          .update({
            design_tokens: updatedTheme.design_tokens,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentTheme.id);

        if (updateThemeError) {
          logger.error('Error updating theme', { error: updateThemeError });
          return false;
        }

        logger.info('Updated theme successfully');
      } catch (error) {
        logger.error('Error updating theme', { error });
        return false;
      }
    }

    // Fetch existing theme components
    const { data: existingComponents, error: getComponentsError } = await supabase
      .from('theme_components')
      .select('*')
      .eq('theme_id', currentTheme.id);

    if (getComponentsError) {
      logger.error('Error fetching theme components', { error: getComponentsError });
      return false;
    }

    // Define base components
    const baseComponents: Partial<ComponentTokens>[] = [
      {
        id: 'main-nav',
        theme_id: currentTheme.id,
        component_name: 'MainNav',
        styles: {
          container: {
            base: 'fixed top-0 w-full z-50 transition-all duration-300',
            animated: 'animate-morph-header'
          },
          header: 'bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] border-b border-primary/30',
          dataStream: 'relative',
          dataStreamEffect: 'mainnav-data-stream',
          glitchParticles: 'mainnav-glitch-particles',
          nav: 'flex items-center gap-1 md:gap-2',
          navItem: 'px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group',
          navItemActive: 'text-primary',
          navItemActiveIndicator: 'absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-center',
          mobileToggle: 'block md:hidden'
        },
        description: 'Main navigation bar styles',
      },
      {
        id: 'footer',
        theme_id: currentTheme.id,
        component_name: 'Footer',
        styles: {
          container: 'bg-background text-foreground py-8',
          content: 'container mx-auto px-4',
          text: 'text-sm text-muted-foreground',
        },
        description: 'Footer styles',
      },
    ];

    // Determine which components need to be created or updated
    const newComponents: Partial<ComponentTokens>[] = [];
    const updatedComponents: Partial<ComponentTokens>[] = [];

    for (const baseComponent of baseComponents) {
      const existingComponent = existingComponents?.find(c => c.component_name === baseComponent.component_name);

      if (!existingComponent) {
        newComponents.push(baseComponent);
      } else {
        // Compare styles and add to updatedComponents if different
        if (JSON.stringify(existingComponent.styles) !== JSON.stringify(baseComponent.styles)) {
          updatedComponents.push({ ...existingComponent, styles: baseComponent.styles });
        }
      }
    }

    // Create new components
    if (newComponents.length > 0) {
      try {
        const { error: createComponentsError } = await supabase
          .from('theme_components')
          .insert(newComponents);

        if (createComponentsError) {
          logger.error('Error creating theme components', { error: createComponentsError });
          return false;
        }

        logger.info('Created theme components successfully', { componentCount: newComponents.length });
      } catch (error) {
        logger.error('Failed to create theme components', { error });
        return false;
      }
    }

    // Update the theme component tokens if needed
    if (updatedComponents.length > 0) {
      try {
        // Update components one by one to ensure proper typing
        for (const component of updatedComponents) {
          if (!component.id) continue;
          
          await supabase
            .from('theme_components')
            .update({
              styles: component.styles,
              updated_at: new Date().toISOString(),
            })
            .eq('id', component.id);
        }
        
        logger.info('Updated theme components successfully', { componentCount: updatedComponents.length });
      } catch (error) {
        logger.error('Failed to update theme components', { error });
        return false;
      }
    }

    logger.info('Impulsivity theme sync completed');
    return true;
  } catch (error) {
    logger.error('Impulsivity theme sync failed', { error });
    return false;
  }
}
