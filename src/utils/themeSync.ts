
import { supabase } from '@/integrations/supabase/client';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { Json } from '@/integrations/supabase/types';
import { PostgrestError } from '@supabase/supabase-js';

const formatPostgrestError = (error: PostgrestError | unknown): Record<string, unknown> => {
  if (!error) return {};
  
  if (typeof error === 'object' && error !== null) {
    if ('code' in error && 'message' in error) {
      return {
        code: (error as { code?: string }).code || 'UNKNOWN',
        message: (error as { message?: string }).message || 'Unknown error',
        details: (error as { details?: string }).details || undefined,
        hint: (error as { hint?: string }).hint || undefined
      };
    }
    
    return { ...Object(error) };
  }
  
  return { message: String(error) };
};

type ThemeSyncOptions = {
  forceCreate?: boolean;
  defaultName?: string;
};

export async function syncImpulsivityTheme(options: ThemeSyncOptions = {}): Promise<boolean> {
  const logger = getLogger('ThemeSync', LogCategory.DATABASE);
  
  try {
    const { forceCreate = false, defaultName = 'Impulsivity' } = options;
    
    const { data: existingThemes, error } = await supabase
      .from('themes')
      .select('id, name, design_tokens')
      .eq('name', defaultName)
      .limit(1);
      
    if (error) {
      logger.error('Error checking for existing theme', { 
        details: formatPostgrestError(error)
      });
      return false;
    }
    
    const existingTheme = existingThemes && existingThemes.length > 0 ? existingThemes[0] : null;
    
    if (existingTheme && !forceCreate) {
      const existingTokens = existingTheme.design_tokens || {};
      const updatedDesignTokens = {
        ...(existingTokens as Record<string, unknown>),
        admin: defaultImpulseTokens
      };
      
      // Cast to Json for type safety
      const safeTokens = JSON.parse(JSON.stringify(updatedDesignTokens)) as Json;
      
      const { error: updateError } = await supabase
        .from('themes')
        .update({
          design_tokens: safeTokens,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingTheme.id);
        
      if (updateError) {
        logger.error('Error updating theme', { 
          details: formatPostgrestError(updateError)
        });
        return false;
      }
      
      logger.info('Successfully updated Impulsivity theme');
      return true;
    }
    
    const themeData = {
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
        // Cast defaultImpulseTokens to Json compatible object
        admin: JSON.parse(JSON.stringify(defaultImpulseTokens))
      }
    };
    
    // Properly serialize to ensure JSON compatibility
    const safeJsonData = JSON.parse(JSON.stringify(themeData));
    
    const { data: newTheme, error: createError } = await supabase
      .from('themes')
      .insert([safeJsonData])
      .select('id')
      .single();
      
    if (createError) {
      logger.error('Error creating theme', { 
        details: formatPostgrestError(createError)
      });
      return false;
    }
    
    if (!newTheme) {
      logger.warn('Theme creation returned no data');
      return false;
    }
    
    const componentData = [
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
        }
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
        }
      }
    ];
    
    const safeComponentData = JSON.parse(JSON.stringify(componentData));
    
    const { error: componentError } = await supabase
      .from('theme_components')
      .insert(safeComponentData);
      
    if (componentError) {
      logger.error('Error adding component tokens', { 
        details: formatPostgrestError(componentError)
      });
      return true; // Still return true as theme was created successfully
    }
    
    logger.info('Successfully created Impulsivity theme with components');
    return true;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unexpected error in syncImpulsivityTheme', { 
      details: { message: errorMessage }
    });
    return false;
  }
}
