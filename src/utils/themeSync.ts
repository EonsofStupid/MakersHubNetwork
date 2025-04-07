
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { useThemeStore } from '@/stores/theme/themeStore';
import { supabase } from '@/lib/supabase';

/**
 * Synchronize the Impulsivity theme with the database
 */
export async function syncImpulsivityTheme(): Promise<boolean> {
  try {
    const logger = getLogger('ThemeSync', LogCategory.THEME);
    logger.info('Starting to sync Impulsivity theme to database');
    
    const { currentTheme, tokens } = useThemeStore.getState();
    
    if (!currentTheme) {
      logger.error('Cannot sync theme: No current theme available');
      return false;
    }

    // First attempt to use Supabase if available
    if (supabase) {
      try {
        logger.info('Syncing theme using Supabase client');
        
        const { data: existingTheme, error: fetchError } = await supabase
          .from('themes')
          .select('id, design_tokens')
          .eq('id', currentTheme.id)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          // If error is not "no rows returned" then log it
          logger.error('Error fetching theme from Supabase:', {
            details: {
              error: fetchError.message,
              code: fetchError.code
            }
          });
        }
        
        // If theme exists, update it
        if (existingTheme) {
          // Create updated design tokens by merging
          const updatedDesignTokens = {
            ...existingTheme.design_tokens,
            colors: {
              ...existingTheme.design_tokens?.colors,
              primary: tokens.primary,
              secondary: tokens.secondary,
            },
            effects: {
              ...existingTheme.design_tokens?.effects,
              primary: tokens.effectPrimary,
              secondary: tokens.effectSecondary,
              tertiary: tokens.effectTertiary,
            }
          };
          
          // Update the theme
          const { error: updateError } = await supabase
            .from('themes')
            .update({
              design_tokens: updatedDesignTokens,
              updated_at: new Date().toISOString()
            })
            .eq('id', currentTheme.id);
          
          if (updateError) {
            logger.error('Error updating theme in Supabase:', {
              details: {
                error: updateError.message,
                code: updateError.code
              }
            });
            return false;
          }
          
          logger.info('Successfully synced theme to Supabase');
          return true;
        } else {
          // No theme found with this ID
          logger.warn('Theme not found in database, cannot sync');
          return false;
        }
      } catch (error) {
        logger.error('Supabase theme sync error:', {
          details: {
            error: error instanceof Error ? error.message : String(error)
          }
        });
      }
    }
    
    // If Supabase sync failed or not available, try edge function
    try {
      logger.info('Attempting to sync theme using edge function');
      
      // This would call a Supabase edge function to update the theme
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-theme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId: currentTheme.id,
          updates: {
            design_tokens: {
              colors: {
                primary: tokens.primary,
                secondary: tokens.secondary
              },
              effects: {
                primary: tokens.effectPrimary,
                secondary: tokens.effectSecondary,
                tertiary: tokens.effectTertiary
              }
            }
          }
        })
      });
      
      if (!response.ok) {
        logger.error('Edge function theme update failed', {
          details: {
            status: response.status,
            statusText: response.statusText
          }
        });
        return false;
      }
      
      logger.info('Successfully synced theme via edge function');
      return true;
    } catch (error) {
      logger.error('Edge function theme sync error:', {
        details: {
          error: error instanceof Error ? error.message : String(error)
        }
      });
      return false;
    }
  } catch (error) {
    const logger = getLogger('ThemeSync', LogCategory.THEME);
    logger.error('Unexpected error in theme sync:', {
      details: {
        error: error instanceof Error ? error.message : String(error)
      }
    });
    return false;
  }
}
