
import { useCallback, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * Provides access to Impulsivity theme functionality
 */
export function useImpulsivityTheme() {
  const logger = useLogger('useImpulsivityTheme', LogCategory.UI);
  const store = useThemeStore();
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Applies the Impulsivity theme to the application
   */
  const applyTheme = useCallback(async () => {
    try {
      setIsSyncing(true);
      logger.info('Applying Impulsivity theme');

      // Load the default Impulsivity theme
      const impulsivityTheme = {
        id: 'impulsivity',
        name: 'Impulsivity',
        tokens: {
          // Colors
          'site-primary': { value: '186 100% 50%', type: 'color' }, // #00F0FF in HSL
          'site-secondary': { value: '334 100% 59%', type: 'color' }, // #FF2D6E in HSL
          'site-background': { value: '#080F1E', type: 'color' },
          'site-foreground': { value: '#F9FAFB', type: 'color' },
          'site-card': { value: '#0F172A', type: 'color' },
          'site-card-foreground': { value: '#F9FAFB', type: 'color' },
          'site-effect-color': { value: '#00F0FF', type: 'color' },
          'site-effect-secondary': { value: '#FF2D6E', type: 'color' },
          'site-border': { value: '#1E293B', type: 'color' },
          
          // Animation times
          'site-transition-fast': { value: '0.15s', type: 'time' },
          'site-transition-normal': { value: '0.3s', type: 'time' },
          'site-transition-slow': { value: '0.5s', type: 'time' },
          
          // Animations
          'site-pulse': {
            value: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            type: 'animation',
            keyframes: `
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            `
          },
          
          // Shadows
          'site-shadow-glow': {
            value: '0 0 10px rgba(0, 240, 255, 0.5)',
            type: 'shadow'
          },
        },
        description: 'Cyberpunk-inspired theme with neon effects',
        author: 'Impulse',
        version: '1.0.0',
        components: {}
      };
      
      // Apply the theme to the store
      await store.setTheme(impulsivityTheme);
      
      logger.info('Impulsivity theme applied successfully');
      return true;
    } catch (error) {
      logger.error('Failed to apply Impulsivity theme', {
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [store, logger]);

  return {
    applyTheme,
    isSyncing
  };
}
