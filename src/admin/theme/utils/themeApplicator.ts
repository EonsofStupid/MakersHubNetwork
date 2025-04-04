
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { getThemeProperty, ensureStringValue, getThemeColorValue } from './themeUtils';
import { hexToRgbString } from './colorUtils';

const logger = getLogger('ThemeApplicator', { category: LogCategory.THEME });

/**
 * Apply theme tokens to the document as CSS variables
 */
export function applyThemeToDocument(theme: Partial<ImpulseTheme>): void {
  try {
    logger.debug('Applying theme to document');
    const root = document.documentElement;
    
    // Set base colors using the getThemeColorValue helper to safely handle nested objects
    applyColorVariable(root, '--color-primary', getThemeColorValue(theme, 'colors.primary', '#00F0FF'));
    applyColorVariable(root, '--color-secondary', getThemeColorValue(theme, 'colors.secondary', '#FF2D6E'));
    applyColorVariable(root, '--color-accent', getThemeColorValue(theme, 'colors.accent', '#8B5CF6'));
    
    // Apply background colors - use getThemeProperty for nested paths
    applyColorVariable(root, '--color-background', getThemeProperty(theme, 'colors.background.main', '#12121A'));
    applyColorVariable(root, '--color-foreground', getThemeProperty(theme, 'colors.text.primary', '#F6F6F7'));
    
    // Apply background colors
    applyColorVariable(root, '--color-bg-main', getThemeProperty(theme, 'colors.background.main', '#12121A'));
    applyColorVariable(root, '--color-bg-card', getThemeProperty(theme, 'colors.background.card', 'rgba(28, 32, 42, 0.7)'));
    applyColorVariable(root, '--color-bg-alt', getThemeProperty(theme, 'colors.background.alt', '#1A1E24'));
    applyColorVariable(root, '--color-bg-overlay', getThemeProperty(theme, 'colors.background.overlay', 'rgba(22, 24, 29, 0.85)'));
    
    // Apply text colors
    applyColorVariable(root, '--color-text-primary', getThemeProperty(theme, 'colors.text.primary', '#F6F6F7'));
    applyColorVariable(root, '--color-text-secondary', getThemeProperty(theme, 'colors.text.secondary', 'rgba(255, 255, 255, 0.7)'));
    applyColorVariable(root, '--color-text-muted', getThemeProperty(theme, 'colors.text.muted', 'rgba(255, 255, 255, 0.5)'));
    applyColorVariable(root, '--color-text-accent', getThemeProperty(theme, 'colors.text.accent', '#00F0FF'));
    
    // Apply status colors
    applyColorVariable(root, '--color-success', getThemeProperty(theme, 'colors.status.success', '#10B981'));
    applyColorVariable(root, '--color-warning', getThemeProperty(theme, 'colors.status.warning', '#F59E0B'));
    applyColorVariable(root, '--color-error', getThemeProperty(theme, 'colors.status.error', '#EF4444'));
    applyColorVariable(root, '--color-info', getThemeProperty(theme, 'colors.status.info', '#3B82F6'));
    
    // Apply border colors
    applyColorVariable(root, '--color-border', getThemeProperty(theme, 'colors.borders.normal', 'rgba(0, 240, 255, 0.2)'));
    applyColorVariable(root, '--color-border-hover', getThemeProperty(theme, 'colors.borders.hover', 'rgba(0, 240, 255, 0.4)'));
    
    // Apply RGB versions for alpha channel usage - use getThemeColorValue to ensure we get strings
    applyRgbVariable(root, '--color-primary', getThemeColorValue(theme, 'colors.primary', '#00F0FF'));
    applyRgbVariable(root, '--color-secondary', getThemeColorValue(theme, 'colors.secondary', '#FF2D6E'));
    applyRgbVariable(root, '--color-accent', getThemeColorValue(theme, 'colors.accent', '#8B5CF6'));
    
    // Apply animation durations
    root.style.setProperty('--animation-duration-fast', getThemeProperty(theme, 'animation.duration.fast', '150ms'));
    root.style.setProperty('--animation-duration-normal', getThemeProperty(theme, 'animation.duration.normal', '300ms'));
    root.style.setProperty('--animation-duration-slow', getThemeProperty(theme, 'animation.duration.slow', '500ms'));
    
    // Apply typography
    root.style.setProperty('--font-family-body', getThemeProperty(theme, 'typography.fonts.body', 'Inter, system-ui, sans-serif'));
    root.style.setProperty('--font-family-heading', getThemeProperty(theme, 'typography.fonts.heading', 'Inter, system-ui, sans-serif'));
    root.style.setProperty('--font-family-mono', getThemeProperty(theme, 'typography.fonts.monospace', 'Consolas, monospace'));
    
    // Apply component styles
    root.style.setProperty('--border-radius-sm', getThemeProperty(theme, 'components.input.radius', '0.375rem'));
    root.style.setProperty('--border-radius-md', getThemeProperty(theme, 'components.button.radius', '0.5rem'));
    root.style.setProperty('--border-radius-lg', getThemeProperty(theme, 'components.panel.radius', '0.75rem'));
    
    // Apply CSS class for the theme
    root.classList.add('theme-applied');
    
    logger.debug('Theme applied successfully');
  } catch (error) {
    logger.error('Failed to apply theme to document', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    // Apply emergency fallback colors
    try {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', '#00F0FF');
      root.style.setProperty('--color-secondary', '#FF2D6E');
      root.style.setProperty('--color-background', '#12121A');
      root.style.setProperty('--color-foreground', '#F6F6F7');
      
      // Apply RGB versions for emergency fallback
      root.style.setProperty('--color-primary-rgb', '0, 240, 255');
      root.style.setProperty('--color-secondary-rgb', '255, 45, 110');
      root.style.setProperty('--color-background-rgb', '18, 18, 26');
    } catch (fallbackError) {
      // Last resort, log but continue
      logger.error('Emergency fallback colors failed to apply', {
        details: { error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error' }
      });
    }
  }
}

/**
 * Safely apply a color variable to the root element
 */
function applyColorVariable(element: HTMLElement, varName: string, color: any): void {
  try {
    const safeColor = ensureStringValue(color, '');
    if (safeColor) {
      element.style.setProperty(varName, safeColor);
    }
  } catch (error) {
    logger.warn(`Failed to apply color variable ${varName}`, {
      details: { color, error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}

/**
 * Apply RGB components of a color as a CSS variable for alpha channel usage
 */
function applyRgbVariable(element: HTMLElement, varName: string, color: any): void {
  try {
    // First ensure it's a string value 
    const safeColor = ensureStringValue(color, '');
    
    // Only process if we have a valid value
    if (safeColor) {
      // For hex colors, convert to RGB
      if (safeColor.startsWith('#')) {
        const rgbString = hexToRgbString(safeColor);
        element.style.setProperty(`${varName}-rgb`, rgbString);
      } 
      // For rgb/rgba colors, extract the RGB components
      else if (safeColor.startsWith('rgb')) {
        const match = safeColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (match) {
          const rgbString = `${match[1]}, ${match[2]}, ${match[3]}`;
          element.style.setProperty(`${varName}-rgb`, rgbString);
        }
      }
      // For other values, try hexToRgbString as a fallback
      else {
        try {
          const rgbString = hexToRgbString(safeColor);
          element.style.setProperty(`${varName}-rgb`, rgbString);
        } catch (err) {
          // If all else fails, log and set a default
          logger.debug(`Could not extract RGB from ${safeColor}`, {
            details: { error: err instanceof Error ? err.message : 'Unknown error' }
          });
          element.style.setProperty(`${varName}-rgb`, '0, 0, 0');
        }
      }
    }
  } catch (error) {
    logger.warn(`Failed to apply RGB variable ${varName}-rgb`, {
      details: { color, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    // Set a default value to prevent further errors
    try {
      element.style.setProperty(`${varName}-rgb`, '0, 0, 0');
    } catch (e) {
      // Nothing left to do at this point
    }
  }
}

/**
 * Create an emergency CSS style element for critical fallback
 */
export function createFallbackStyles(): void {
  try {
    // Check if fallback styles already exist
    if (document.getElementById('theme-fallback-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'theme-fallback-styles';
    style.textContent = `
      :root {
        --color-primary: #00F0FF;
        --color-secondary: #FF2D6E;
        --color-accent: #8B5CF6;
        --color-background: #12121A;
        --color-foreground: #F6F6F7;
        --color-bg-main: #12121A;
        --color-bg-card: rgba(28, 32, 42, 0.7);
        --color-bg-alt: #1A1E24;
        --color-text-primary: #F6F6F7;
        --color-text-secondary: rgba(255, 255, 255, 0.7);
        --color-text-muted: rgba(255, 255, 255, 0.5);
        --color-success: #10B981;
        --color-warning: #F59E0B;
        --color-error: #EF4444;
        --color-info: #3B82F6;
        --color-primary-rgb: 0, 240, 255;
        --color-secondary-rgb: 255, 45, 110;
        --color-accent-rgb: 139, 92, 246;
      }
      
      /* Immediate application of critical colors to important elements */
      html, body {
        background-color: #12121A;
        color: #F6F6F7;
      }
      
      /* Additional safety styles */
      .theme-fallback-active .bg-background {
        background-color: #12121A !important;
      }
      
      .theme-fallback-active .text-primary {
        color: #00F0FF !important;
      }
    `;
    
    document.head.appendChild(style);
    logger.info('Emergency fallback styles created');
    
    // Add class to document to indicate fallback is active
    document.documentElement.classList.add('theme-fallback-active');
  } catch (error) {
    logger.error('Failed to create fallback styles', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}

/**
 * Apply emergency theme directly to HTML element to ensure critical styling
 * before any JS executes
 */
export function applyEmergencyTheme(): void {
  try {
    const root = document.documentElement;
    
    // Direct style application
    root.style.backgroundColor = '#12121A';
    root.style.color = '#F6F6F7';
    
    // Critical CSS variables
    root.style.setProperty('--color-primary', '#00F0FF');
    root.style.setProperty('--color-secondary', '#FF2D6E');
    root.style.setProperty('--color-accent', '#8B5CF6');
    root.style.setProperty('--color-background', '#12121A');
    root.style.setProperty('--color-foreground', '#F6F6F7');
    root.style.setProperty('--color-primary-rgb', '0, 240, 255');
    
    // Add indicator class
    root.classList.add('emergency-theme-applied');
    
    logger.info('Emergency theme applied directly');
  } catch (error) {
    // At this point there's nothing else we can do
    console.error('Critical theme failure:', error);
  }
}
