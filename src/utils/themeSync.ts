
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { Theme, ComponentTokens, ThemeToken } from '@/types/theme';

const logger = getLogger('ThemeSync', LogCategory.SYSTEM);

/**
 * Sync the Impulsivity theme to the database
 */
export async function syncImpulsivityTheme(): Promise<boolean> {
  try {
    logger.info('Starting Impulsivity theme sync');
    
    // Check if the theme already exists
    const { data: existingTheme, error: fetchError } = await supabase
      .from('themes')
      .select('*')
      .eq('name', 'Impulsivity')
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      logger.error('Error fetching existing theme', { details: fetchError });
      return false;
    }
    
    // Define the Impulsivity theme
    const theme: Theme = {
      id: existingTheme?.id || undefined,
      name: 'Impulsivity',
      description: 'A cyberpunk-inspired theme with neon effects and vivid colors',
      status: 'published',
      is_default: true,
      created_by: undefined,
      created_at: existingTheme?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: existingTheme?.published_at || new Date().toISOString(),
      version: Number(existingTheme?.version || 1),
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
          shadows: {
            sm: '0 1px 2px rgba(0, 240, 255, 0.1)',
            md: '0 4px 6px rgba(0, 240, 255, 0.15)',
            lg: '0 10px 15px rgba(0, 240, 255, 0.2)',
          },
          blurs: {
            sm: 'blur(4px)',
            md: 'blur(8px)',
            lg: 'blur(16px)',
          },
          gradients: {
            primary: 'linear-gradient(135deg, #00F0FF 0%, #00A3FF 100%)',
            secondary: 'linear-gradient(135deg, #FF2D6E 0%, #FF6B44 100%)',
            accent: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
          },
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          tertiary: '#8B5CF6',
        },
        spacing: {
          padding: {
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
          },
          margin: {
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
          },
          radius: {
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem',
            full: '9999px',
          },
        },
        typography: {
          fontSizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
          },
          fontFamilies: {
            sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            heading: '"Geist", system-ui, sans-serif',
            body: '"Inter", system-ui, sans-serif',
            mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          lineHeights: {
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75',
          },
          letterSpacing: {
            tighter: '-0.05em',
            tight: '-0.025em',
            normal: '0',
            wide: '0.025em',
            wider: '0.05em',
          },
        },
        animation: {
          keyframes: {
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
            'scale-out': {
              '0%': { transform: 'scale(1)', opacity: '1' },
              '100%': { transform: 'scale(0.95)', opacity: '0' }
            },
            'float': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(-20px) rotate(5deg)' }
            },
            'footer-float': {
              '0%, 100%': { transform: 'perspective(1000px) rotateX(1deg) translateY(0)' },
              '50%': { transform: 'perspective(1000px) rotateX(2deg) translateY(-10px)' }
            },
            'morph-header': {
              '0%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'translateZ(0)' },
              '100%': { clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)', transform: 'translateZ(20px)' }
            },
            'morph-shape': {
              '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
              '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }
            },
            'pulse-slow': {
              '0%': { opacity: '0.4', transform: 'translateY(0)' },
              '50%': { opacity: '0.1', transform: 'translateY(-100vh)' },
              '100%': { opacity: '0.4', transform: 'translateY(-200vh)' }
            },
            'pulse': {
              '0%, 100%': { opacity: '1' },
              '50%': { opacity: '0.5' }
            },
            'gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            }
          },
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
      component_tokens: [
        {
          id: '1',
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
          context: 'site'
        },
        {
          id: '2',
          component_name: 'Footer',
          styles: {
            base: 'footer-base',
            gradient: 'footer-gradient',
            container: 'footer-container',
            transform: 'footer-transform',
          },
          context: 'site'
        },
        {
          id: '3',
          component_name: 'CyberCard',
          styles: {
            base: 'relative overflow-hidden rounded-lg border border-primary/20 bg-background/40 backdrop-blur-xl transition-all duration-300 hover:border-primary/40',
            gradient: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-secondary/5 before:to-primary/5',
          },
          context: 'site'
        }
      ],
      composition_rules: {},
      cached_styles: {}
    };
    
    // Insert or update the theme
    if (existingTheme?.id) {
      logger.info('Updating existing Impulsivity theme', { 
        details: { id: existingTheme.id } 
      });
      
      // Update existing theme
      const { error: updateError } = await supabase
        .from('themes')
        .update({
          description: theme.description,
          status: theme.status,
          is_default: theme.is_default,
          updated_at: theme.updated_at,
          published_at: theme.published_at,
          version: Number(existingTheme.version || 0) + 1,
          design_tokens: theme.design_tokens,
          component_tokens: theme.component_tokens,
          composition_rules: theme.composition_rules,
        })
        .eq('id', existingTheme.id);
      
      if (updateError) {
        logger.error('Failed to update theme', { details: updateError });
        return false;
      }
    } else {
      logger.info('Creating new Impulsivity theme');
      
      // Insert new theme
      const { error: insertError } = await supabase
        .from('themes')
        .insert({
          name: theme.name,
          description: theme.description,
          status: theme.status,
          is_default: theme.is_default,
          created_at: theme.created_at,
          updated_at: theme.updated_at,
          published_at: theme.published_at,
          version: 1,
          design_tokens: theme.design_tokens,
          component_tokens: theme.component_tokens,
          composition_rules: theme.composition_rules,
        });
      
      if (insertError) {
        logger.error('Failed to insert theme', { details: insertError });
        return false;
      }
    }
    
    logger.info('Successfully synced Impulsivity theme');
    return true;
    
  } catch (error) {
    logger.error('Error in syncImpulsivityTheme', { details: error });
    return false;
  }
}
