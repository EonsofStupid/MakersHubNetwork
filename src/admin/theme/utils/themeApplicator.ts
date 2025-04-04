
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { getThemeProperty, ensureStringValue, getThemeColorValue } from './themeUtils';
import { hexToRgbString, validateColor } from './colorUtils';

const logger = getLogger('ThemeApplicator', { category: LogCategory.THEME });

// Emergency fallback colors - used when everything else fails
const EMERGENCY_COLORS = {
  background: '#12121A',
  foreground: '#F6F6F7',
  primary: '#00F0FF',
  secondary: '#FF2D6E',
  accent: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
};

/**
 * Check if current theme has all critical variables set correctly
 */
export function verifyThemeApplication(): boolean {
  try {
    const root = document.documentElement;
    const criticalVars = [
      getComputedStyle(root).getPropertyValue('--color-primary'),
      getComputedStyle(root).getPropertyValue('--color-background'),
      getComputedStyle(root).getPropertyValue('--color-foreground')
    ];
    
    return criticalVars.every(value => value && value.trim() !== '');
  } catch (error) {
    logger.error('Error validating theme application', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return false;
  }
}

/**
 * Apply theme tokens to the document as CSS variables with robust validation
 */
export function applyThemeToDocument(theme: Partial<ImpulseTheme>): void {
  try {
    if (!theme || typeof theme !== 'object') {
      logger.warn('Invalid theme object provided', { details: { theme } });
      applyEmergencyTheme();
      return;
    }
    
    logger.debug('Applying theme to document');
    const root = document.documentElement;
    
    // Set base colors using the getThemeColorValue helper to safely handle nested objects
    applyColorVariable(root, '--color-primary', getThemeColorValue(theme, 'colors.primary', EMERGENCY_COLORS.primary));
    applyColorVariable(root, '--color-secondary', getThemeColorValue(theme, 'colors.secondary', EMERGENCY_COLORS.secondary));
    applyColorVariable(root, '--color-accent', getThemeColorValue(theme, 'colors.accent', EMERGENCY_COLORS.accent));
    
    // Apply background colors - use getThemeProperty for nested paths
    applyColorVariable(root, '--color-background', getThemeProperty(theme, 'colors.background.main', EMERGENCY_COLORS.background));
    applyColorVariable(root, '--color-foreground', getThemeProperty(theme, 'colors.text.primary', EMERGENCY_COLORS.foreground));
    
    // Apply background colors with fallbacks
    applyColorVariable(root, '--color-bg-main', getThemeProperty(theme, 'colors.background.main', EMERGENCY_COLORS.background));
    applyColorVariable(root, '--color-bg-card', getThemeProperty(theme, 'colors.background.card', 'rgba(28, 32, 42, 0.7)'));
    applyColorVariable(root, '--color-bg-alt', getThemeProperty(theme, 'colors.background.alt', '#1A1E24'));
    applyColorVariable(root, '--color-bg-overlay', getThemeProperty(theme, 'colors.background.overlay', 'rgba(22, 24, 29, 0.85)'));
    
    // Apply text colors with fallbacks
    applyColorVariable(root, '--color-text-primary', getThemeProperty(theme, 'colors.text.primary', EMERGENCY_COLORS.foreground));
    applyColorVariable(root, '--color-text-secondary', getThemeProperty(theme, 'colors.text.secondary', 'rgba(255, 255, 255, 0.7)'));
    applyColorVariable(root, '--color-text-muted', getThemeProperty(theme, 'colors.text.muted', 'rgba(255, 255, 255, 0.5)'));
    applyColorVariable(root, '--color-text-accent', getThemeProperty(theme, 'colors.text.accent', EMERGENCY_COLORS.primary));
    
    // Apply status colors with fallbacks
    applyColorVariable(root, '--color-success', getThemeProperty(theme, 'colors.status.success', EMERGENCY_COLORS.success));
    applyColorVariable(root, '--color-warning', getThemeProperty(theme, 'colors.status.warning', EMERGENCY_COLORS.warning));
    applyColorVariable(root, '--color-error', getThemeProperty(theme, 'colors.status.error', EMERGENCY_COLORS.error));
    applyColorVariable(root, '--color-info', getThemeProperty(theme, 'colors.status.info', '#3B82F6'));
    
    // Apply border colors with fallbacks
    applyColorVariable(root, '--color-border', getThemeProperty(theme, 'colors.borders.normal', 'rgba(0, 240, 255, 0.2)'));
    applyColorVariable(root, '--color-border-hover', getThemeProperty(theme, 'colors.borders.hover', 'rgba(0, 240, 255, 0.4)'));
    
    // Apply RGB versions for alpha channel usage - with robust error handling
    applyRgbVariable(root, '--color-primary', getThemeColorValue(theme, 'colors.primary', EMERGENCY_COLORS.primary));
    applyRgbVariable(root, '--color-secondary', getThemeColorValue(theme, 'colors.secondary', EMERGENCY_COLORS.secondary));
    applyRgbVariable(root, '--color-accent', getThemeColorValue(theme, 'colors.accent', EMERGENCY_COLORS.accent));
    
    // Apply animation durations with validation
    applyStringVariable(root, '--animation-duration-fast', getThemeProperty(theme, 'animation.duration.fast', '150ms'));
    applyStringVariable(root, '--animation-duration-normal', getThemeProperty(theme, 'animation.duration.normal', '300ms'));
    applyStringVariable(root, '--animation-duration-slow', getThemeProperty(theme, 'animation.duration.slow', '500ms'));
    
    // Apply typography with validation
    applyStringVariable(root, '--font-family-body', getThemeProperty(theme, 'typography.fonts.body', 'Inter, system-ui, sans-serif'));
    applyStringVariable(root, '--font-family-heading', getThemeProperty(theme, 'typography.fonts.heading', 'Inter, system-ui, sans-serif'));
    applyStringVariable(root, '--font-family-mono', getThemeProperty(theme, 'typography.fonts.mono', 'Consolas, monospace'));
    
    // Apply component styles with validation
    applyStringVariable(root, '--border-radius-sm', getThemeProperty(theme, 'components.input.radius', '0.375rem'));
    applyStringVariable(root, '--border-radius-md', getThemeProperty(theme, 'components.button.radius', '0.5rem'));
    applyStringVariable(root, '--border-radius-lg', getThemeProperty(theme, 'components.panel.radius', '0.75rem'));
    
    // Apply Impulse-specific variables
    applyColorVariable(root, '--impulse-primary', getThemeColorValue(theme, 'colors.primary', EMERGENCY_COLORS.primary));
    applyColorVariable(root, '--impulse-secondary', getThemeColorValue(theme, 'colors.secondary', EMERGENCY_COLORS.secondary));
    applyColorVariable(root, '--impulse-accent', getThemeColorValue(theme, 'colors.accent', EMERGENCY_COLORS.accent));
    applyColorVariable(root, '--impulse-success', getThemeProperty(theme, 'colors.status.success', EMERGENCY_COLORS.success));
    applyColorVariable(root, '--impulse-warning', getThemeProperty(theme, 'colors.status.warning', EMERGENCY_COLORS.warning));
    applyColorVariable(root, '--impulse-error', getThemeProperty(theme, 'colors.status.error', EMERGENCY_COLORS.error));
    
    // Apply CSS class for the theme
    root.classList.add('theme-applied');
    
    // Verify critical variables were applied
    if (!verifyThemeApplication()) {
      logger.warn('Critical theme variables not applied correctly, applying emergency fallbacks');
      // Apply emergency styles for critical variables only
      applyEmergencyCriticalStyles();
    }
    
    logger.debug('Theme applied successfully');
  } catch (error) {
    logger.error('Failed to apply theme to document', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    // Apply emergency theme on failure
    applyEmergencyTheme();
  }
}

/**
 * Apply only critical emergency styles - less intrusive than full emergency theme
 */
function applyEmergencyCriticalStyles(): void {
  try {
    const root = document.documentElement;
    
    // Apply emergency styles for critical variables
    root.style.setProperty('--color-primary', EMERGENCY_COLORS.primary);
    root.style.setProperty('--color-background', EMERGENCY_COLORS.background);
    root.style.setProperty('--color-foreground', EMERGENCY_COLORS.foreground);
    root.style.setProperty('--color-primary-rgb', '0, 240, 255');
    root.style.setProperty('--impulse-primary', EMERGENCY_COLORS.primary);
    
    logger.info('Critical emergency styles applied');
  } catch (error) {
    logger.error('Failed to apply critical emergency styles', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}

/**
 * Safely apply a string variable with validation
 */
function applyStringVariable(element: HTMLElement, varName: string, value: any): void {
  try {
    const safeValue = ensureStringValue(value, '');
    if (safeValue) {
      element.style.setProperty(varName, safeValue);
    }
  } catch (error) {
    logger.warn(`Failed to apply string variable ${varName}`, {
      details: { value, error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}

/**
 * Safely apply a color variable to the root element with validation
 */
function applyColorVariable(element: HTMLElement, varName: string, color: any): void {
  try {
    const safeColor = ensureStringValue(color, '');
    if (safeColor) {
      element.style.setProperty(varName, safeColor);
    } else {
      logger.warn(`Empty color for ${varName}, using fallback`);
      // Apply a fallback based on the variable name
      if (varName.includes('primary')) element.style.setProperty(varName, EMERGENCY_COLORS.primary);
      else if (varName.includes('secondary')) element.style.setProperty(varName, EMERGENCY_COLORS.secondary);
      else if (varName.includes('accent')) element.style.setProperty(varName, EMERGENCY_COLORS.accent);
      else if (varName.includes('background')) element.style.setProperty(varName, EMERGENCY_COLORS.background);
      else if (varName.includes('foreground')) element.style.setProperty(varName, EMERGENCY_COLORS.foreground);
    }
  } catch (error) {
    logger.warn(`Failed to apply color variable ${varName}`, {
      details: { color, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    // Apply a fallback color for critical variables
    try {
      if (varName === '--color-primary') element.style.setProperty(varName, EMERGENCY_COLORS.primary);
      else if (varName === '--color-background') element.style.setProperty(varName, EMERGENCY_COLORS.background);
      else if (varName === '--color-foreground') element.style.setProperty(varName, EMERGENCY_COLORS.foreground);
    } catch (fallbackError) {
      // Last resort logging
      console.error(`Critical failure applying ${varName}`, fallbackError);
    }
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
      let rgbString = '';
      
      // For hex colors, convert to RGB
      if (safeColor.startsWith('#')) {
        rgbString = hexToRgbString(safeColor);
        element.style.setProperty(`${varName}-rgb`, rgbString);
      } 
      // For rgb/rgba colors, extract the RGB components
      else if (safeColor.startsWith('rgb')) {
        const match = safeColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (match) {
          rgbString = `${match[1]}, ${match[2]}, ${match[3]}`;
          element.style.setProperty(`${varName}-rgb`, rgbString);
        } else {
          // Fallback to default values
          element.style.setProperty(`${varName}-rgb`, getDefaultRgb(varName));
        }
      }
      // For other values, try hexToRgbString as a fallback
      else {
        try {
          rgbString = hexToRgbString(safeColor);
          element.style.setProperty(`${varName}-rgb`, rgbString);
        } catch (err) {
          // If all else fails, set a default
          element.style.setProperty(`${varName}-rgb`, getDefaultRgb(varName));
        }
      }
      
      // Verify the RGB string is valid
      if (!rgbString || (rgbString === '0, 0, 0' && varName !== '--color-black')) {
        logger.debug(`Using fallback RGB for ${varName}`);
        element.style.setProperty(`${varName}-rgb`, getDefaultRgb(varName));
      }
    } else {
      // Set default RGB values for empty colors
      element.style.setProperty(`${varName}-rgb`, getDefaultRgb(varName));
    }
  } catch (error) {
    logger.warn(`Failed to apply RGB variable ${varName}-rgb`, {
      details: { color, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    // Set a default value to prevent further errors
    try {
      element.style.setProperty(`${varName}-rgb`, getDefaultRgb(varName));
    } catch (e) {
      // Nothing left to do at this point
    }
  }
}

/**
 * Get default RGB string based on variable name
 */
function getDefaultRgb(varName: string): string {
  if (varName.includes('primary')) return '0, 240, 255';  // #00F0FF
  if (varName.includes('secondary')) return '255, 45, 110'; // #FF2D6E
  if (varName.includes('background')) return '18, 18, 26';  // #12121A
  if (varName.includes('foreground')) return '246, 246, 247'; // #F6F6F7
  if (varName.includes('accent')) return '139, 92, 246';    // #8B5CF6
  if (varName.includes('success')) return '16, 185, 129';   // #10B981
  if (varName.includes('warning')) return '245, 158, 11';   // #F59E0B
  if (varName.includes('error')) return '239, 68, 68';      // #EF4444
  return '0, 0, 0'; // Default black
}

/**
 * Create an emergency CSS style element for critical fallback
 */
export function createFallbackStyles(): void {
  try {
    // Check if fallback styles already exist
    if (document.getElementById('theme-fallback-styles')) {
      logger.debug('Fallback styles already exist, skipping creation');
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'theme-fallback-styles';
    style.textContent = `
      :root {
        --color-primary: ${EMERGENCY_COLORS.primary};
        --color-secondary: ${EMERGENCY_COLORS.secondary};
        --color-accent: ${EMERGENCY_COLORS.accent};
        --color-background: ${EMERGENCY_COLORS.background};
        --color-foreground: ${EMERGENCY_COLORS.foreground};
        --color-bg-main: ${EMERGENCY_COLORS.background};
        --color-bg-card: rgba(28, 32, 42, 0.7);
        --color-bg-alt: #1A1E24;
        --color-text-primary: ${EMERGENCY_COLORS.foreground};
        --color-text-secondary: rgba(255, 255, 255, 0.7);
        --color-text-muted: rgba(255, 255, 255, 0.5);
        --color-success: ${EMERGENCY_COLORS.success};
        --color-warning: ${EMERGENCY_COLORS.warning};
        --color-error: ${EMERGENCY_COLORS.error};
        --color-info: #3B82F6;
        --color-primary-rgb: 0, 240, 255;
        --color-secondary-rgb: 255, 45, 110;
        --color-accent-rgb: 139, 92, 246;
        --color-background-rgb: 18, 18, 26;
        --font-family-body: Inter, system-ui, sans-serif;
        --font-family-heading: Inter, system-ui, sans-serif;
        --font-family-mono: Consolas, monospace;
        --border-radius-sm: 0.375rem;
        --border-radius-md: 0.5rem;
        --border-radius-lg: 0.75rem;
        --impulse-primary: ${EMERGENCY_COLORS.primary};
        --impulse-secondary: ${EMERGENCY_COLORS.secondary};
        --impulse-accent: ${EMERGENCY_COLORS.accent};
        --impulse-success: ${EMERGENCY_COLORS.success};
        --impulse-warning: ${EMERGENCY_COLORS.warning};
        --impulse-error: ${EMERGENCY_COLORS.error};
      }
      
      /* Immediate application of critical colors to important elements */
      html, body {
        background-color: ${EMERGENCY_COLORS.background};
        color: ${EMERGENCY_COLORS.foreground};
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      /* Additional safety styles */
      .theme-fallback-active .bg-background {
        background-color: ${EMERGENCY_COLORS.background} !important;
      }
      
      .theme-fallback-active .text-primary {
        color: ${EMERGENCY_COLORS.primary} !important;
      }
      
      .theme-fallback-active button {
        color: ${EMERGENCY_COLORS.foreground};
        border-color: ${EMERGENCY_COLORS.primary};
      }
      
      .theme-fallback-active a {
        color: ${EMERGENCY_COLORS.primary};
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
 */
export function applyEmergencyTheme(): void {
  try {
    const root = document.documentElement;
    
    // Direct style application
    root.style.backgroundColor = EMERGENCY_COLORS.background;
    root.style.color = EMERGENCY_COLORS.foreground;
    document.body.style.backgroundColor = EMERGENCY_COLORS.background;
    document.body.style.color = EMERGENCY_COLORS.foreground;
    
    // Critical CSS variables
    root.style.setProperty('--color-primary', EMERGENCY_COLORS.primary);
    root.style.setProperty('--color-secondary', EMERGENCY_COLORS.secondary);
    root.style.setProperty('--color-accent', EMERGENCY_COLORS.accent);
    root.style.setProperty('--color-background', EMERGENCY_COLORS.background);
    root.style.setProperty('--color-foreground', EMERGENCY_COLORS.foreground);
    root.style.setProperty('--color-primary-rgb', '0, 240, 255');
    root.style.setProperty('--color-secondary-rgb', '255, 45, 110');
    root.style.setProperty('--color-accent-rgb', '139, 92, 246');
    root.style.setProperty('--color-background-rgb', '18, 18, 26');
    
    // Impulse-specific variables
    root.style.setProperty('--impulse-primary', EMERGENCY_COLORS.primary);
    root.style.setProperty('--impulse-secondary', EMERGENCY_COLORS.secondary);
    root.style.setProperty('--impulse-accent', EMERGENCY_COLORS.accent);
    root.style.setProperty('--impulse-success', EMERGENCY_COLORS.success);
    root.style.setProperty('--impulse-warning', EMERGENCY_COLORS.warning);
    root.style.setProperty('--impulse-error', EMERGENCY_COLORS.error);
    
    // Add indicator classes
    root.classList.add('emergency-theme-applied');
    root.classList.add('theme-fallback-active');
    
    // Set data attributes for debugging
    root.setAttribute('data-theme-status', 'emergency');
    
    logger.info('Emergency theme applied directly');
  } catch (error) {
    // At this point there's nothing else we can do
    console.error('Critical theme failure:', error);
  }
}
