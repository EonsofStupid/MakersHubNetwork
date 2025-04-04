
import { ImpulseTheme } from "@/admin/types/impulse.types";
import { getLogger } from "@/logging";
import { LogCategory } from "@/constants/logLevel";
import { getThemeProperty, ensureStringValue, getThemeColorValue } from "./themeUtils";
import { EMERGENCY_COLORS, FALLBACKS } from '../constants';

/**
 * Apply theme values directly to document CSS variables
 */
export function applyThemeToDocument(theme: ImpulseTheme): void {
  const logger = getLogger('themeApplicator', { category: LogCategory.THEME });
  const root = document.documentElement;
  
  try {
    // Apply main colors
    root.style.setProperty('--impulse-primary', getThemeColorValue(theme, 'colors.primary', '#00F0FF'));
    root.style.setProperty('--impulse-secondary', getThemeColorValue(theme, 'colors.secondary', '#FF2D6E'));
    root.style.setProperty('--impulse-accent', getThemeColorValue(theme, 'colors.accent', '#8B5CF6'));
    
    // Background colors
    root.style.setProperty('--impulse-bg-main', getThemeColorValue(theme, 'colors.background.main', '#12121A'));
    root.style.setProperty('--impulse-bg-overlay', getThemeColorValue(theme, 'colors.background.overlay', 'rgba(22, 24, 29, 0.85)'));
    root.style.setProperty('--impulse-bg-card', getThemeColorValue(theme, 'colors.background.card', 'rgba(28, 32, 42, 0.7)'));
    root.style.setProperty('--impulse-bg-alt', getThemeColorValue(theme, 'colors.background.alt', '#1A1E24'));
    
    // Text colors
    root.style.setProperty('--impulse-text-primary', getThemeColorValue(theme, 'colors.text.primary', '#F6F6F7'));
    root.style.setProperty('--impulse-text-secondary', getThemeColorValue(theme, 'colors.text.secondary', 'rgba(255, 255, 255, 0.7)'));
    root.style.setProperty('--impulse-text-muted', getThemeColorValue(theme, 'colors.text.muted', 'rgba(255, 255, 255, 0.5)'));
    root.style.setProperty('--impulse-text-accent', getThemeColorValue(theme, 'colors.text.accent', '#00F0FF'));
    
    // Border colors
    root.style.setProperty('--impulse-border-normal', getThemeColorValue(theme, 'colors.borders.normal', 'rgba(0, 240, 255, 0.2)'));
    root.style.setProperty('--impulse-border-hover', getThemeColorValue(theme, 'colors.borders.hover', 'rgba(0, 240, 255, 0.4)'));
    root.style.setProperty('--impulse-border-active', getThemeColorValue(theme, 'colors.borders.active', 'rgba(0, 240, 255, 0.6)'));
    root.style.setProperty('--impulse-border-focus', getThemeColorValue(theme, 'colors.borders.focus', 'rgba(0, 240, 255, 0.5)'));
    
    // Status colors
    root.style.setProperty('--impulse-status-success', getThemeColorValue(theme, 'colors.status.success', '#10B981'));
    root.style.setProperty('--impulse-status-warning', getThemeColorValue(theme, 'colors.status.warning', '#F59E0B'));
    root.style.setProperty('--impulse-status-error', getThemeColorValue(theme, 'colors.status.error', '#EF4444'));
    root.style.setProperty('--impulse-status-info', getThemeColorValue(theme, 'colors.status.info', '#3B82F6'));
    
    // Typography
    root.style.setProperty('--impulse-font-body', ensureStringValue(getThemeProperty(theme, 'typography.fonts.body', 'Inter, system-ui, sans-serif'), 'Inter, system-ui, sans-serif'));
    root.style.setProperty('--impulse-font-heading', ensureStringValue(getThemeProperty(theme, 'typography.fonts.heading', 'Inter, system-ui, sans-serif'), 'Inter, system-ui, sans-serif'));
    root.style.setProperty('--impulse-font-mono', ensureStringValue(getThemeProperty(theme, 'typography.fonts.mono', 'Consolas, monospace'), 'Consolas, monospace'));
    
    // Effects
    root.style.setProperty('--impulse-glow-primary', ensureStringValue(getThemeProperty(theme, 'effects.glow.primary', '0 0 15px rgba(0, 240, 255, 0.7)'), '0 0 15px rgba(0, 240, 255, 0.7)'));
    root.style.setProperty('--impulse-shadow-sm', ensureStringValue(getThemeProperty(theme, 'effects.shadows.sm', '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'), '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'));
    
    // Components
    root.style.setProperty('--impulse-panel-radius', ensureStringValue(getThemeProperty(theme, 'components.panel.radius', '0.75rem'), '0.75rem'));
    root.style.setProperty('--impulse-panel-padding', ensureStringValue(getThemeProperty(theme, 'components.panel.padding', '1.5rem'), '1.5rem'));
    root.style.setProperty('--impulse-panel-bg', ensureStringValue(getThemeProperty(theme, 'components.panel.background', 'rgba(28, 32, 42, 0.7)'), 'rgba(28, 32, 42, 0.7)'));
    
    // Add theme-applied class to document
    root.classList.add('impulse-theme-applied');
    
    logger.debug('Theme applied successfully', {
      details: {
        themeId: theme.id,
        themeName: theme.name
      }
    });
  } catch (error) {
    logger.error('Error applying theme to document', {
      details: { error }
    });
  }
}

/**
 * Create fallback styles to ensure interface is visible even if theme application fails
 */
export function createFallbackStyles(): void {
  const logger = getLogger('themeApplicator', { category: LogCategory.THEME });
  try {
    const style = document.createElement('style');
    style.id = 'impulse-fallback-styles';
    style.textContent = `
      :root {
        --impulse-primary: ${EMERGENCY_COLORS.primary};
        --impulse-secondary: ${EMERGENCY_COLORS.secondary};
        --impulse-bg-main: ${EMERGENCY_COLORS.background};
        --impulse-text-primary: ${EMERGENCY_COLORS.foreground};
        color-scheme: dark;
      }
      
      html.theme-fallback-applied {
        background-color: ${EMERGENCY_COLORS.background};
        color: ${EMERGENCY_COLORS.foreground};
      }
      
      html.theme-fallback-applied body {
        background-color: ${EMERGENCY_COLORS.background};
        color: ${EMERGENCY_COLORS.foreground};
      }
      
      .impulse-admin-root {
        --color-primary: ${EMERGENCY_COLORS.primary};
        --color-secondary: ${EMERGENCY_COLORS.secondary};
        --color-background: ${EMERGENCY_COLORS.background};
        --color-foreground: ${EMERGENCY_COLORS.foreground};
      }
    `;
    document.head.appendChild(style);
    logger.debug('Fallback styles applied');
  } catch (error) {
    logger.error('Failed to apply fallback styles', {
      details: { error }
    });
  }
}

/**
 * Apply emergency theme in case of critical failures
 */
export function applyEmergencyTheme(): void {
  const logger = getLogger('themeApplicator', { category: LogCategory.THEME });
  try {
    const root = document.documentElement;
    
    // Apply emergency colors directly
    root.style.backgroundColor = EMERGENCY_COLORS.background;
    root.style.color = EMERGENCY_COLORS.foreground;
    document.body.style.backgroundColor = EMERGENCY_COLORS.background;
    document.body.style.color = EMERGENCY_COLORS.foreground;
    
    // Set critical CSS variables
    root.style.setProperty('--impulse-primary', EMERGENCY_COLORS.primary);
    root.style.setProperty('--impulse-secondary', EMERGENCY_COLORS.secondary);
    root.style.setProperty('--impulse-accent', EMERGENCY_COLORS.accent);
    root.style.setProperty('--color-primary', EMERGENCY_COLORS.primary);
    root.style.setProperty('--color-secondary', EMERGENCY_COLORS.secondary);
    
    // Add emergency classes
    root.classList.add('theme-emergency-applied');
    root.classList.add('impulse-theme-applied');
    
    logger.warn('Emergency theme applied due to critical failure');
  } catch (error) {
    logger.error('Failed to apply emergency theme', {
      details: { error }
    });
  }
}

/**
 * Verify theme was applied correctly
 */
export function verifyThemeApplication(): boolean {
  const logger = getLogger('themeApplicator', { category: LogCategory.THEME });
  try {
    const root = document.documentElement;
    const primary = root.style.getPropertyValue('--impulse-primary');
    const background = root.style.getPropertyValue('--impulse-bg-main');
    
    const hasThemeClass = root.classList.contains('impulse-theme-applied');
    
    if (!primary || !background || !hasThemeClass) {
      logger.warn('Theme verification failed', {
        details: { 
          primary: !!primary, 
          background: !!background, 
          hasThemeClass
        }
      });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error during theme verification', {
      details: { error }
    });
    return false;
  }
}
