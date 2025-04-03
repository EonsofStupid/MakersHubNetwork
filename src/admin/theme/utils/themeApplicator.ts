
import { ImpulseTheme } from '../../types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeApplicator', LogCategory.THEME);

/**
 * Applies a theme to the document by setting CSS variables
 */
export function applyThemeToDocument(theme: ImpulseTheme): void {
  try {
    if (!theme || !theme.colors) {
      logger.warn('Invalid theme provided to applyThemeToDocument');
      return;
    }

    const root = document.documentElement;
    
    // Apply basic colors
    root.style.setProperty('--color-primary', hexToRgbString(theme.colors.primary));
    root.style.setProperty('--color-secondary', hexToRgbString(theme.colors.secondary));
    root.style.setProperty('--color-accent', hexToRgbString(theme.colors.accent) || '139, 92, 246');
    
    // Apply background colors
    if (theme.colors.background) {
      root.style.setProperty('--color-background', hexToRgbString(theme.colors.background.main));
      root.style.setProperty('--color-card', hexToRgbString(theme.colors.background.card));
    }
    
    // Apply text colors
    if (theme.colors.text) {
      root.style.setProperty('--color-text', hexToRgbString(theme.colors.text.primary));
      root.style.setProperty('--color-text-secondary', hexToRgbString(theme.colors.text.secondary));
    }
    
    // Apply border colors
    if (theme.colors.borders) {
      root.style.setProperty('--color-border', hexToRgbString(theme.colors.borders.normal));
    }
    
    // Apply status colors
    if (theme.colors.status) {
      root.style.setProperty('--color-success', hexToRgbString(theme.colors.status.success));
      root.style.setProperty('--color-warning', hexToRgbString(theme.colors.status.warning));
      root.style.setProperty('--color-error', hexToRgbString(theme.colors.status.error));
    }
    
    // Apply radii
    if (theme.components?.panel) {
      root.style.setProperty('--radius-panel', theme.components.panel.radius || '0.75rem');
    }
    
    if (theme.components?.button) {
      root.style.setProperty('--radius-button', theme.components.button.radius || '0.5rem');
    }
    
    // Apply typography if available
    if (theme.typography?.fonts) {
      if (theme.typography.fonts.body) {
        root.style.setProperty('--font-body', theme.typography.fonts.body);
      }
      if (theme.typography.fonts.heading) {
        root.style.setProperty('--font-heading', theme.typography.fonts.heading);
      }
    }
    
    // Apply direct theme references for shared variables
    root.style.setProperty('--impulse-primary', theme.colors.primary || '#00F0FF');
    root.style.setProperty('--impulse-secondary', theme.colors.secondary || '#FF2D6E');
    root.style.setProperty('--impulse-accent', theme.colors.accent || '#8B5CF6');
    
    logger.info('Theme applied to document successfully');
  } catch (error) {
    logger.error('Error applying theme to document', { details: safeDetails(error) });
  }
}

/**
 * Converts hex color to RGB format for CSS variables
 * With enhanced error handling to prevent crashes
 */
export function hexToRgbString(hex?: string): string {
  if (!hex) return '0, 0, 0';
  
  try {
    // Handle different color formats
    if (typeof hex !== 'string') {
      logger.warn(`Invalid hex value, expected string but got ${typeof hex}`);
      return '0, 0, 0';
    }
    
    // Handle RGB/RGBA format
    if (hex.startsWith('rgb')) {
      const matches = hex.match(/\d+/g);
      if (matches && matches.length >= 3) {
        return `${matches[0]}, ${matches[1]}, ${matches[2]}`;
      }
      return '0, 0, 0';
    }
    
    // Handle shorthand hex
    let color = hex.replace('#', '');
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    
    // Handle standard hex
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // Handle invalid values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      logger.warn(`Invalid hex color format: ${hex}`);
      return '0, 0, 0';
    }
    
    return `${r}, ${g}, ${b}`;
  } catch (error) {
    logger.error('Error processing color', { details: safeDetails({ color: hex, error }) });
    return '0, 0, 0';
  }
}
