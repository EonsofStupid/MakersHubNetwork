import { supabase } from '@/integrations/supabase/client';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { Json } from '@/integrations/supabase/types';

type ThemeSyncOptions = {
  forceCreate?: boolean;
  defaultName?: string;
};

export async function syncImpulsivityTheme(options: ThemeSyncOptions = {}): Promise<boolean> {
  const logger = getLogger('ThemeSync', LogCategory.DATABASE);
  
  try {
    const { forceCreate = false, defaultName = 'Impulsivity' } = options;
    
    // Check if theme exists
    const { data: existingThemes, error } = await supabase
      .from('themes')
      .select('id, name, design_tokens')
      .eq('name', defaultName)
      .limit(1);
      
    if (error) {
      logger.error('Error checking for existing theme', { details: error });
      return false;
    }
    
    const existingTheme = existingThemes && existingThemes.length > 0 ? existingThemes[0] : null;
    
    // If theme exists and we're not forcing creation, update it
    if (existingTheme && !forceCreate) {
      // Prepare design tokens with Impulsivity defaults
      const updatedDesignTokens = {
        ...(existingTheme.design_tokens as Record<string, unknown> || {}),
        admin: defaultImpulseTokens
      };
      
      // Update the theme
      const { error: updateError } = await supabase
        .from('themes')
        .update({
          design_tokens: updatedDesignTokens as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingTheme.id);
        
      if (updateError) {
        logger.error('Error updating theme', { details: updateError });
        return false;
      }
      
      logger.info('Successfully updated Impulsivity theme');
      return true;
    }
    
    // Otherwise create a new theme
    const { data: newTheme, error: createError } = await supabase
      .from('themes')
      .insert([
        {
          name: defaultName,
          description: 'A cyberpunk-inspired theme with neon glow effects',
          status: 'published',
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          design_tokens: {
            colors: {
              background: "#080F1E",
              foreground: "#F9FAFB",
              card: "#0E172A",
              cardForeground: "#F9FAFB", 
              primary: "#00F0FF",
              primaryForeground: "#F9FAFB",
              secondary: "#FF2D6E",
              secondaryForeground: "#F9FAFB",
              muted: "#131D35",
              mutedForeground: "#94A3B8",
              accent: "#131D35",
              accentForeground: "#F9FAFB",
              destructive: "#EF4444",
              destructiveForeground: "#F9FAFB",
              border: "#131D35",
              input: "#131D35",
              ring: "#1E293B",
            },
            effects: {
              shadows: {},
              blurs: {},
              gradients: {},
              primary: "#00F0FF",
              secondary: "#FF2D6E",
              tertiary: "#8B5CF6",
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
            },
            admin: defaultImpulseTokens
          } as Json
        }
      ])
      .select('id')
      .single();
      
    if (createError) {
      logger.error('Error creating theme', { details: createError });
      return false;
    }
    
    if (!newTheme) {
      logger.warn('Theme creation returned no data');
      return false;
    }
    
    // Add default component tokens
    const { error: componentError } = await supabase
      .from('component_tokens')
      .insert([
        {
          component_name: 'Button',
          theme_id: newTheme.id,
          context: 'site',
          styles: {
            base: 'relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90',
            variants: {
              cyber: 'border border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary/80',
              neon: 'shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:shadow-[0_0_25px_rgba(0,240,255,0.8)]'
            }
          } as Json
        },
        {
          component_name: 'Card',
          theme_id: newTheme.id,
          context: 'site',
          styles: {
            base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
            variants: {
              cyber: 'border border-primary/30 bg-black/40 backdrop-blur-xl',
              glass: 'bg-white/10 backdrop-blur-xl border border-white/20'
            }
          } as Json
        }
      ]);
      
    if (componentError) {
      logger.error('Error adding component tokens', { details: componentError });
      return true; // Still return true as theme was created successfully
    }
    
    logger.info('Successfully created Impulsivity theme with components');
    return true;
    
  } catch (error) {
    logger.error('Unexpected error in syncImpulsivityTheme', { 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    return false;
  }
}
