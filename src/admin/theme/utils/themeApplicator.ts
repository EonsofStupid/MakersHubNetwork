
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { hexToRgbString } from './colorUtils';

const logger = getLogger('ThemeApplicator', { category: LogCategory.THEME as string });

/**
 * Applies a theme to the document by setting CSS variables
 */
export function applyThemeToDocument(theme: Partial<ImpulseTheme>): void {
  try {
    if (!theme || !theme.colors) {
      logger.warn('Invalid theme provided to applyThemeToDocument');
      return;
    }
    
    const root = document.documentElement;
    
    // Apply color variables
    if (theme.colors) {
      // Primary colors
      if (theme.colors.primary) {
        root.style.setProperty('--impulse-primary', theme.colors.primary);
        root.style.setProperty('--color-primary', hexToRgbString(theme.colors.primary));
      }
      
      if (theme.colors.secondary) {
        root.style.setProperty('--impulse-secondary', theme.colors.secondary);
        root.style.setProperty('--color-secondary', hexToRgbString(theme.colors.secondary));
      }
      
      if (theme.colors.accent) {
        root.style.setProperty('--impulse-accent', theme.colors.accent);
        root.style.setProperty('--color-accent', hexToRgbString(theme.colors.accent));
      }
      
      // Background colors
      if (theme.colors.background?.main) {
        root.style.setProperty('--impulse-bg-main', theme.colors.background.main);
      }
      
      if (theme.colors.background?.card) {
        root.style.setProperty('--impulse-bg-card', theme.colors.background.card);
      }
      
      if (theme.colors.background?.overlay) {
        root.style.setProperty('--impulse-bg-overlay', theme.colors.background.overlay);
      }
      
      if (theme.colors.background?.alt) {
        root.style.setProperty('--impulse-bg-alt', theme.colors.background.alt);
      }
      
      // Text colors
      if (theme.colors.text?.primary) {
        root.style.setProperty('--impulse-text-primary', theme.colors.text.primary);
      }
      
      if (theme.colors.text?.secondary) {
        root.style.setProperty('--impulse-text-secondary', theme.colors.text.secondary);
      }
      
      if (theme.colors.text?.muted) {
        root.style.setProperty('--impulse-text-muted', theme.colors.text.muted);
      }
      
      // Status colors
      if (theme.colors.status?.success) {
        root.style.setProperty('--impulse-success', theme.colors.status.success);
      }
      
      if (theme.colors.status?.error) {
        root.style.setProperty('--impulse-error', theme.colors.status.error);
      }
      
      if (theme.colors.status?.warning) {
        root.style.setProperty('--impulse-warning', theme.colors.status.warning);
      }
      
      if (theme.colors.status?.info) {
        root.style.setProperty('--impulse-info', theme.colors.status.info);
      }
    }
    
    // Apply effect variables
    if (theme.effects) {
      if (theme.effects.shadows?.small) {
        root.style.setProperty('--impulse-shadow-sm', theme.effects.shadows.small);
      }
      
      if (theme.effects.shadows?.medium) {
        root.style.setProperty('--impulse-shadow-md', theme.effects.shadows.medium);
      }
      
      if (theme.effects.shadows?.large) {
        root.style.setProperty('--impulse-shadow-lg', theme.effects.shadows.large);
      }
      
      if (theme.effects.glow?.primary) {
        root.style.setProperty('--impulse-glow-primary', theme.effects.glow.primary);
      }
      
      if (theme.effects.glow?.secondary) {
        root.style.setProperty('--impulse-glow-secondary', theme.effects.glow.secondary);
      }
    }
    
    // Apply typography variables
    if (theme.typography) {
      if (theme.typography.fonts?.body) {
        root.style.setProperty('--impulse-font-body', theme.typography.fonts.body);
      }
      
      if (theme.typography.fonts?.heading) {
        root.style.setProperty('--impulse-font-heading', theme.typography.fonts.heading);
      }
      
      if (theme.typography.fonts?.monospace) {
        root.style.setProperty('--impulse-font-mono', theme.typography.fonts.monospace);
      }
    }
    
    // Apply component variables
    if (theme.components) {
      if (theme.components.panel?.radius) {
        root.style.setProperty('--impulse-panel-radius', theme.components.panel.radius);
      }
      
      if (theme.components.button?.radius) {
        root.style.setProperty('--impulse-button-radius', theme.components.button.radius);
      }
    }
    
    // Add a class to show theme is applied
    root.classList.add('impulse-theme-applied');
    
    logger.debug('Theme applied to document', { 
      details: { 
        themeName: theme.name || 'Unknown theme',
        themeId: theme.id || 'Unknown ID'
      } 
    });
  } catch (error) {
    logger.error('Failed to apply theme to document', { 
      details: { 
        error: error instanceof Error ? error.message : String(error),
        theme: theme ? theme.name : 'undefined theme'
      } 
    });
  }
}
