
import React, { useEffect } from 'react';
import { defaultImpulseTokens } from '../impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { getThemeProperty } from '../utils/themeUtils';

/**
 * Component that applies fallback styles for the admin theme
 * This ensures a consistent dark theme appearance is applied immediately,
 * preventing white flash during initial load
 */
export function ThemeFallback() {
  const logger = getLogger('AdminThemeFallback', { category: LogCategory.THEME });
  
  useEffect(() => {
    try {
      logger.debug('Applying admin theme fallback styles');
      
      // Get theme properties with fallbacks
      const bgMain = getThemeProperty(defaultImpulseTokens, 'colors.background.main', '#12121A');
      const textPrimary = getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7');
      const bgCard = getThemeProperty(defaultImpulseTokens, 'colors.background.card', 'rgba(28, 32, 42, 0.7)');
      const textSecondary = getThemeProperty(defaultImpulseTokens, 'colors.text.secondary', 'rgba(255, 255, 255, 0.7)');
      
      // Create a style element for immediate styling
      const styleElement = document.createElement('style');
      styleElement.id = 'admin-theme-fallback';
      
      // Set global CSS variables and basic styles
      styleElement.textContent = `
        :root {
          --admin-bg-main: ${bgMain};
          --admin-text-primary: ${textPrimary};
          --admin-bg-card: ${bgCard};
          --admin-text-secondary: ${textSecondary};
          --admin-primary: ${defaultImpulseTokens.colors?.primary || '#00F0FF'};
          --admin-secondary: ${defaultImpulseTokens.colors?.secondary || '#FF2D6E'};
          --admin-accent: ${defaultImpulseTokens.colors?.accent || '#8B5CF6'};
          --admin-border: ${getThemeProperty(defaultImpulseTokens, 'colors.borders.normal', 'rgba(0, 240, 255, 0.2)')};
        }
        
        .impulse-admin-root {
          background-color: var(--admin-bg-main);
          color: var(--admin-text-primary);
        }
        
        .impulse-admin-root .admin-panel {
          background-color: var(--admin-bg-card);
          border: 1px solid var(--admin-border);
          border-radius: 0.5rem;
        }
        
        .impulse-admin-root .admin-text-secondary {
          color: var(--admin-text-secondary);
        }
        
        .impulse-admin-root .admin-text-primary {
          color: var(--admin-text-primary);
        }
        
        .impulse-admin-root .admin-text-accent {
          color: var(--admin-primary);
        }
        
        .impulse-admin-root .admin-border {
          border-color: var(--admin-border);
        }
        
        .impulse-admin-root .admin-bg-dark {
          background-color: var(--admin-bg-main);
        }
        
        .impulse-admin-root .admin-bg-card {
          background-color: var(--admin-bg-card);
        }
        
        .impulse-admin-root .admin-text-destructive {
          color: ${getThemeProperty(defaultImpulseTokens, 'colors.status.error', '#EF4444')};
        }
        
        /* Animation durations */
        .impulse-admin-root .admin-transition-fast {
          transition-duration: ${getThemeProperty(defaultImpulseTokens, 'animation.duration.fast', '150ms')};
        }
        .impulse-admin-root .admin-transition-normal {
          transition-duration: ${getThemeProperty(defaultImpulseTokens, 'animation.duration.normal', '300ms')};
        }
        .impulse-admin-root .admin-transition-slow {
          transition-duration: ${getThemeProperty(defaultImpulseTokens, 'animation.duration.slow', '500ms')};
        }
        
        /* Effect styles */
        .impulse-admin-root .admin-glow-primary {
          box-shadow: ${getThemeProperty(defaultImpulseTokens, 'effects.glow.primary', '0 0 15px rgba(0, 240, 255, 0.7)')};
        }
        .impulse-admin-root .admin-glow-secondary {
          box-shadow: ${getThemeProperty(defaultImpulseTokens, 'effects.glow.secondary', '0 0 15px rgba(255, 45, 110, 0.7)')};
        }
        .impulse-admin-root .admin-glow-hover {
          box-shadow: ${getThemeProperty(defaultImpulseTokens, 'effects.glow.hover', '0 0 20px rgba(0, 240, 255, 0.9)')};
        }
        
        /* Override fonts for admin section */
        .impulse-admin-root {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        /* Force dark theme for admin UI */
        .impulse-admin-root * {
          --background: ${getThemeProperty(defaultImpulseTokens, 'colors.background.main', '#12121A')};
          --foreground: ${getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7')};
          --card: ${getThemeProperty(defaultImpulseTokens, 'colors.background.card', 'rgba(28, 32, 42, 0.7)')};
          --card-foreground: ${getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7')};
          --popover-background: ${getThemeProperty(defaultImpulseTokens, 'colors.background.card', 'rgba(28, 32, 42, 0.95)')};
          --popover-foreground: ${getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7')};
          --primary: ${defaultImpulseTokens.colors?.primary || '#00F0FF'};
          --primary-foreground: ${getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7')};
          --secondary: ${defaultImpulseTokens.colors?.secondary || '#FF2D6E'};
          --secondary-foreground: ${getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7')};
          --muted: ${getThemeProperty(defaultImpulseTokens, 'colors.text.secondary', 'rgba(255, 255, 255, 0.7)')};
          --muted-foreground: ${getThemeProperty(defaultImpulseTokens, 'colors.text.muted', 'rgba(255, 255, 255, 0.5)')};
          --accent: ${defaultImpulseTokens.colors?.accent || '#8B5CF6'};
          --accent-foreground: ${getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7')};
          --destructive: ${getThemeProperty(defaultImpulseTokens, 'colors.status.error', '#EF4444')};
          --destructive-foreground: ${getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7')};
          --border: ${getThemeProperty(defaultImpulseTokens, 'colors.borders.normal', 'rgba(0, 240, 255, 0.2)')};
          --input: ${getThemeProperty(defaultImpulseTokens, 'colors.background.main', '#12121A')};
          --ring: ${defaultImpulseTokens.colors?.primary || '#00F0FF'};
          --radius: 0.5rem;
        }
      `;
      
      // Add the style element to the head
      document.head.appendChild(styleElement);
      
      // Return cleanup function
      return () => {
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
      };
    } catch (error) {
      logger.error('Error applying admin theme fallback', {
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return () => {};
    }
  }, [logger]);
  
  return null; // This component doesn't render anything visible
}
