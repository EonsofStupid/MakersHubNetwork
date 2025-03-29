
import { supabase } from '@/integrations/supabase/client';
import { Theme } from '@/types/theme';

/**
 * Ensures that the database has the current theme
 * This function will create the theme if it doesn't exist
 */
export async function ensureDefaultTheme(): Promise<string> {
  try {
    // Check if default theme exists
    const { data: existingTheme, error: checkError } = await supabase
      .from('themes')
      .select('id')
      .eq('is_default', true)
      .limit(1)
      .single();
    
    if (!checkError && existingTheme) {
      return existingTheme.id;
    }
    
    // Create default theme with all our current styling
    const defaultTheme: Partial<Theme> = {
      name: 'Makers Impulse Default',
      description: 'The default theme for Makers Impulse with cyber styling',
      status: 'published',
      is_default: true,
      version: 1,
      design_tokens: {
        colors: {
          background: '#161923',
          foreground: '#FFFFFF',
          card: '#1E2130',
          cardForeground: '#FFFFFF',
          primary: '#00F0FF',
          primaryForeground: '#FFFFFF',
          secondary: '#FF2D6E',
          secondaryForeground: '#FFFFFF',
          muted: '#1E2337',
          mutedForeground: '#9CA3AF',
          accent: '#1E2337',
          accentForeground: '#FFFFFF',
          destructive: '#EF4444',
          destructiveForeground: '#FFFFFF',
          border: '#1E2337',
          input: '#1E2337',
          ring: '#2A3149'
        },
        effects: {
          shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            glow: '0 0 15px 0 rgba(0, 240, 255, 0.3)'
          },
          blurs: {
            sm: 'blur(4px)',
            default: 'blur(8px)',
            md: 'blur(12px)',
            lg: 'blur(16px)',
            xl: 'blur(24px)',
            '2xl': 'blur(40px)'
          },
          gradients: {
            primary: 'linear-gradient(to right, #00F0FF, #FFFFFF, #00F0FF)',
            secondary: 'linear-gradient(to right, #FF2D6E, #FFFFFF, #FF2D6E)',
            accent: 'linear-gradient(to right, #00F0FF, #FF2D6E)'
          },
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          tertiary: '#8B5CF6'
        },
        spacing: {
          radius: {
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem',
            full: '9999px'
          }
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
            '5xl': '3rem',
            '6xl': '3.75rem',
            '7xl': '4.5rem',
            '8xl': '6rem',
            '9xl': '8rem'
          },
          fontFamilies: {
            sans: 'Inter, sans-serif',
            heading: 'Space Grotesk, sans-serif'
          },
          lineHeights: {
            none: '1',
            tight: '1.25',
            snug: '1.375',
            normal: '1.5',
            relaxed: '1.625',
            loose: '2'
          },
          letterSpacing: {
            tighter: '-0.05em',
            tight: '-0.025em',
            normal: '0',
            wide: '0.025em',
            wider: '0.05em',
            widest: '0.1em'
          }
        },
        animation: {
          durations: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
            animationFast: '1s',
            animationNormal: '2s',
            animationSlow: '3s'
          },
          transitions: {
            default: 'all var(--site-transition-normal) cubic-bezier(0.4, 0, 0.2, 1)',
            fast: 'all var(--site-transition-fast) cubic-bezier(0.4, 0, 0.2, 1)',
            slow: 'all var(--site-transition-slow) cubic-bezier(0.4, 0, 0.2, 1)'
          },
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
            'float': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(-20px) rotate(5deg)' }
            },
            'pulse-slow': {
              '0%': { opacity: '0.4', transform: 'translateY(0)' },
              '50%': { opacity: '0.1', transform: 'translateY(-100vh)' },
              '100%': { opacity: '0.4', transform: 'translateY(-200vh)' }
            },
            'morph-header': {
              '0%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'translateZ(0)' },
              '100%': { clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)', transform: 'translateZ(20px)' }
            },
            'gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            },
            'footer-float': {
              '0%, 100%': { transform: 'perspective(1000px) rotateX(1deg) translateY(0)' },
              '50%': { transform: 'perspective(1000px) rotateX(2deg) translateY(-10px)' }
            }
          }
        }
      }
    };
    
    // Create initial component styles for the database
    const initialComponentStyles = [
      {
        component_name: 'SimpleCyberText',
        styles: {
          base: 'relative inline-block',
          primary: 'absolute -top-[2px] left-[2px] text-primary/40 z-10 skew-x-6',
          secondary: 'absolute -bottom-[2px] left-[-2px] text-secondary/40 z-10 skew-x-[-6deg]'
        }
      },
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
    
    // Insert the theme into the database
    const { data: newTheme, error: insertError } = await supabase
      .from('themes')
      .insert(defaultTheme)
      .select()
      .single();
    
    if (insertError) throw insertError;
    if (!newTheme) throw new Error('Failed to create default theme');
    
    // Insert initial component styles
    for (const component of initialComponentStyles) {
      const { error: componentError } = await supabase
        .from('theme_components')
        .insert({
          theme_id: newTheme.id,
          component_name: component.component_name,
          styles: component.styles
        });
        
      if (componentError) throw componentError;
    }
    
    return newTheme.id;
  } catch (error) {
    console.error('Error ensuring default theme:', error);
    throw error;
  }
}

/**
 * Initialize theme from the database or create it if missing
 */
export async function initializeTheme(): Promise<string | null> {
  try {
    return await ensureDefaultTheme();
  } catch (error) {
    console.error('Theme initialization error:', error);
    return null;
  }
}
