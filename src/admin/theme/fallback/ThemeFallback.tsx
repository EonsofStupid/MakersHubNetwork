
import React, { useEffect } from 'react';
import { defaultImpulseTokens } from '../impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

/**
 * ThemeFallback - Applies minimal CSS variables immediately to prevent FOUC
 * This component applies critical theme variables directly to prevent white flash
 */
export function ThemeFallback() {
  const logger = getLogger('ThemeFallback', { category: LogCategory.THEME });
  
  useEffect(() => {
    try {
      logger.debug('Applying immediate fallback styles');
      
      const root = document.documentElement;
      
      // Critical background/text colors to prevent flash
      if (defaultImpulseTokens.colors.background) {
        root.style.setProperty('--background', defaultImpulseTokens.colors.background.main);
      }
      if (defaultImpulseTokens.colors.text) {
        root.style.setProperty('--foreground', defaultImpulseTokens.colors.text.primary);
      }
      if (defaultImpulseTokens.colors.background) {
        root.style.setProperty('--impulse-bg-main', defaultImpulseTokens.colors.background.main);
      }
      if (defaultImpulseTokens.colors.text) {
        root.style.setProperty('--impulse-text-primary', defaultImpulseTokens.colors.text.primary);
      }
      
      // Apply immediately to the body/html as well
      const applyToDom = () => {
        if (defaultImpulseTokens.colors.background) {
          document.body.style.backgroundColor = defaultImpulseTokens.colors.background.main;
          document.documentElement.style.backgroundColor = defaultImpulseTokens.colors.background.main;
        }
        if (defaultImpulseTokens.colors.text) {
          document.body.style.color = defaultImpulseTokens.colors.text.primary;
          document.documentElement.style.color = defaultImpulseTokens.colors.text.primary;
        }
      };
      
      applyToDom();
      
      // Also set critical variables for UI components
      if (defaultImpulseTokens.colors.background) {
        root.style.setProperty('--card', defaultImpulseTokens.colors.background.card);
      }
      if (defaultImpulseTokens.colors.text) {
        root.style.setProperty('--card-foreground', defaultImpulseTokens.colors.text.primary);
      }
      if (defaultImpulseTokens.colors.background) {
        root.style.setProperty('--popover', defaultImpulseTokens.colors.background.card);
      }
      if (defaultImpulseTokens.colors.text) {
        root.style.setProperty('--popover-foreground', defaultImpulseTokens.colors.text.primary);
      }
      
      root.style.setProperty('--primary', defaultImpulseTokens.colors.primary);
      if (defaultImpulseTokens.colors.text) {
        root.style.setProperty('--primary-foreground', defaultImpulseTokens.colors.text.primary);
      }
      
      root.style.setProperty('--secondary', defaultImpulseTokens.colors.secondary);
      if (defaultImpulseTokens.colors.text) {
        root.style.setProperty('--secondary-foreground', defaultImpulseTokens.colors.text.primary);
      }
      
      if (defaultImpulseTokens.colors.status) {
        root.style.setProperty('--destructive', defaultImpulseTokens.colors.status.error);
      }
      if (defaultImpulseTokens.colors.text) {
        root.style.setProperty('--destructive-foreground', defaultImpulseTokens.colors.text.primary);
      }
      if (defaultImpulseTokens.colors.borders) {
        root.style.setProperty('--border', defaultImpulseTokens.colors.borders.normal);
      }
      
      // Add animation timing variables
      if (defaultImpulseTokens.animation?.duration) {
        root.style.setProperty('--transition-fast', defaultImpulseTokens.animation.duration.fast);
        root.style.setProperty('--transition-normal', defaultImpulseTokens.animation.duration.normal);
        root.style.setProperty('--transition-slow', defaultImpulseTokens.animation.duration.slow);
      }
      
      // Add effect variables
      if (defaultImpulseTokens.effects?.glow) {
        root.style.setProperty('--glow-primary', defaultImpulseTokens.effects.glow.primary);
        root.style.setProperty('--glow-secondary', defaultImpulseTokens.effects.glow.secondary);
        root.style.setProperty('--glow-hover', defaultImpulseTokens.effects.glow.hover);
      }
      
      // Add classes for immediate styling
      if (defaultImpulseTokens.colors.background) {
        root.classList.add('impulse-theme-ready');
      }
    } catch (error) {
      logger.error('Error applying fallback styles', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  }, [logger]);
  
  // This is a utility component that doesn't render anything
  return null;
}
