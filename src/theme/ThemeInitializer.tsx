
import { useEffect, useState } from 'react';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';
import { applyThemeToDocument } from '@/admin/theme/utils/themeApplicator';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';
import { supabase } from '@/integrations/supabase/client';

// Create a specific logger for theme initialization
const logger = getLogger('ThemeInitializer', LogCategory.THEME);

// Default emergency fallback styles
const defaultStyles = {
  '--background': '#080F1E',
  '--foreground': '#F9FAFB',
  '--primary': '#00F0FF',
  '--secondary': '#FF2D6E',
  '--accent': '#8B5CF6',
};

export function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect runs once at startup to initialize the theme system
  useEffect(() => {
    let isMounted = true;
    
    const initializeTheme = async () => {
      try {
        logger.info('Starting theme initialization');
        
        // Apply immediate fallback to prevent FOUC
        applyFallbackStyles();
        
        // Register default theme
        themeRegistry.registerTheme('default', defaultImpulseTokens);
        logger.debug('Default theme registered');
        
        // Apply default theme immediately
        applyThemeToDocument(defaultImpulseTokens);
        
        // Try to load published default theme from database
        try {
          const { data, error } = await supabase
            .from('themes')
            .select('*')
            .eq('is_default', true)
            .eq('status', 'published')
            .limit(1)
            .single();
          
          if (error) throw error;
          
          if (data) {
            logger.info('Default theme loaded from database', { 
              details: { themeId: data.id, themeName: data.name } 
            });
            
            // Apply design tokens from the database theme
            const designTokens = data.design_tokens;
            if (designTokens) {
              // Create a theme structure for the applicator
              const dbTheme = {
                id: data.id,
                name: data.name,
                version: data.version?.toString() || '1.0.0',
                colors: designTokens.colors || defaultImpulseTokens.colors,
                effects: designTokens.effects || defaultImpulseTokens.effects,
                animation: designTokens.animation || defaultImpulseTokens.animation,
                components: designTokens.components || defaultImpulseTokens.components,
                typography: designTokens.typography || defaultImpulseTokens.typography
              };
              
              // Apply the theme
              applyThemeToDocument(dbTheme);
              logger.debug('Database theme applied successfully');
            }
          }
        } catch (dbError) {
          logger.warn('Could not load theme from database, using default', {
            details: safeDetails(dbError)
          });
          // Continue with the default theme already applied
        }
        
        if (isMounted) {
          setIsInitialized(true);
          logger.info('Theme initialization completed successfully');
        }
      } catch (error) {
        logger.error('Theme initialization failed', { 
          details: safeDetails(error) 
        });
        
        // Ensure fallback styles are applied in case of error
        applyFallbackStyles();
        
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };
    
    initializeTheme();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Apply emergency fallback styles directly to ensure no FOUC
  const applyFallbackStyles = () => {
    try {
      const root = document.documentElement;
      
      // Apply critical base styles
      for (const [key, value] of Object.entries(defaultStyles)) {
        root.style.setProperty(key, value);
      }
      
      // Add data attribute for debugging
      root.setAttribute('data-theme-fallback', 'applied');
      
      logger.debug('Fallback styles applied');
    } catch (error) {
      logger.error('Failed to apply fallback styles', { 
        details: safeDetails(error) 
      });
    }
  };

  return <>{children}</>;
}
