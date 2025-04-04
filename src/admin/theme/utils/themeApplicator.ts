
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { getThemeProperty, ensureStringValue } from './themeUtils';
import { hexToRgbString } from './colorUtils';

const logger = getLogger('ThemeApplicator', { category: LogCategory.THEME });

/**
 * Apply theme tokens to the document as CSS variables
 */
export function applyThemeToDocument(theme: Partial<ImpulseTheme>): void {
  try {
    logger.debug('Applying theme to document');
    const root = document.documentElement;
    
    // Set base colors
    applyColorVariable(root, '--color-primary', theme?.colors?.primary);
    applyColorVariable(root, '--color-secondary', theme?.colors?.secondary);
    applyColorVariable(root, '--color-accent', theme?.colors?.accent);
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
    applyColorVariable(root, '--color-text-accent', getThemeProperty(theme, 'colors.text.accent', theme?.colors?.primary || '#00F0FF'));
    
    // Apply status colors
    applyColorVariable(root, '--color-success', getThemeProperty(theme, 'colors.status.success', '#10B981'));
    applyColorVariable(root, '--color-warning', getThemeProperty(theme, 'colors.status.warning', '#F59E0B'));
    applyColorVariable(root, '--color-error', getThemeProperty(theme, 'colors.status.error', '#EF4444'));
    applyColorVariable(root, '--color-info', getThemeProperty(theme, 'colors.status.info', '#3B82F6'));
    
    // Apply border colors
    applyColorVariable(root, '--color-border', getThemeProperty(theme, 'colors.borders.normal', 'rgba(0, 240, 255, 0.2)'));
    applyColorVariable(root, '--color-border-hover', getThemeProperty(theme, 'colors.borders.hover', 'rgba(0, 240, 255, 0.4)'));
    
    // Apply RGB versions for alpha channel usage
    applyRgbVariable(root, '--color-primary', theme?.colors?.primary);
    applyRgbVariable(root, '--color-secondary', theme?.colors?.secondary);
    applyRgbVariable(root, '--color-accent', theme?.colors?.accent);
    
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
    const safeColor = ensureStringValue(color, '');
    if (safeColor && safeColor.startsWith('#')) {
      const rgbString = hexToRgbString(safeColor);
      element.style.setProperty(`${varName}-rgb`, rgbString);
    }
  } catch (error) {
    logger.warn(`Failed to apply RGB variable ${varName}-rgb`, {
      details: { color, error: error instanceof Error ? error.message : 'Unknown error' }
    });
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
    `;
    
    document.head.appendChild(style);
    logger.info('Emergency fallback styles created');
  } catch (error) {
    logger.error('Failed to create fallback styles', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}
