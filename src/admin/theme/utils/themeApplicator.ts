
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getThemeProperty, ensureStringValue } from './themeUtils';
import { hexToHSL, hexToRgbString, ensureHexColor } from './colorUtils';

const logger = getLogger('ThemeApplicator', { category: LogCategory.THEME as string });

/**
 * Apply a theme to the document by setting CSS variables
 */
export function applyThemeToDocument(theme: ImpulseTheme): void {
  try {
    if (!theme || typeof theme !== 'object') {
      logger.warn('Invalid theme object provided to applyThemeToDocument');
      return;
    }
    
    // Performance tracking
    const startTime = performance.now();
    const root = document.documentElement;
    
    // Get critical theme colors with fallbacks - using safe getThemeProperty
    const bgColor = ensureStringValue(getThemeProperty(theme, 'colors.background.main', '#12121A'));
    const textColor = ensureStringValue(getThemeProperty(theme, 'colors.text.primary', '#F6F6F7'));
    const primaryColor = ensureStringValue(getThemeProperty(theme, 'colors.primary', '#00F0FF'));
    const secondaryColor = ensureStringValue(getThemeProperty(theme, 'colors.secondary', '#FF2D6E'));
    const accentColor = ensureStringValue(getThemeProperty(theme, 'colors.accent', '#8B5CF6'));
    
    // Set standardized CSS variables in multiple formats for maximum compatibility
    try {
      // HSL format for Tailwind CSS
      root.style.setProperty('--background', hexToHSL(bgColor));
      root.style.setProperty('--foreground', hexToHSL(textColor));
      root.style.setProperty('--primary', hexToHSL(primaryColor));
      root.style.setProperty('--primary-foreground', hexToHSL('#FFFFFF'));
      root.style.setProperty('--secondary', hexToHSL(secondaryColor));
      root.style.setProperty('--secondary-foreground', hexToHSL('#FFFFFF'));
      root.style.setProperty('--accent', hexToHSL(accentColor));
      root.style.setProperty('--accent-foreground', hexToHSL('#FFFFFF'));
      
      // Also apply to impulse-specific variables for consistency
      root.style.setProperty('--impulse-background', hexToHSL(bgColor));
      root.style.setProperty('--impulse-foreground', hexToHSL(textColor));
      root.style.setProperty('--impulse-primary', hexToHSL(primaryColor));
      root.style.setProperty('--impulse-secondary', hexToHSL(secondaryColor));
      root.style.setProperty('--impulse-accent', hexToHSL(accentColor));
      
      // Admin-specific HSL variables
      root.style.setProperty('--admin-background', hexToHSL(bgColor));
      root.style.setProperty('--admin-foreground', hexToHSL(textColor));
      root.style.setProperty('--admin-primary', hexToHSL(primaryColor));
      root.style.setProperty('--admin-secondary', hexToHSL(secondaryColor));
      root.style.setProperty('--admin-accent', hexToHSL(accentColor));
      
      logger.debug('Applied HSL theme variables');
    } catch (hslError) {
      logger.error('Error setting HSL colors', { details: safeDetails(hslError) });
      // Fallback to hardcoded HSL values
      root.style.setProperty('--background', '224 10% 9%');
      root.style.setProperty('--foreground', '220 6% 97%');
      root.style.setProperty('--primary', '183 100% 50%');
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--secondary', '341 100% 59%');
      root.style.setProperty('--secondary-foreground', '0 0% 100%');
      root.style.setProperty('--accent', '263 85% 74%');
      root.style.setProperty('--accent-foreground', '0 0% 100%');
    }
    
    // Set RGB variables for color manipulation
    try {
      // Set RGB variables (used for rgba() color manipulation)
      root.style.setProperty('--color-primary', hexToRgbString(primaryColor));
      root.style.setProperty('--color-secondary', hexToRgbString(secondaryColor));
      root.style.setProperty('--color-accent', hexToRgbString(accentColor));
      root.style.setProperty('--color-background', hexToRgbString(bgColor));
      root.style.setProperty('--color-foreground', hexToRgbString(textColor));
      
      // Impulse-specific RGB variables
      root.style.setProperty('--impulse-primary-rgb', hexToRgbString(primaryColor));
      root.style.setProperty('--impulse-secondary-rgb', hexToRgbString(secondaryColor));
      root.style.setProperty('--impulse-accent-rgb', hexToRgbString(accentColor));
      root.style.setProperty('--impulse-background-rgb', hexToRgbString(bgColor));
      
      // Site-specific RGB variables
      root.style.setProperty('--site-primary-rgb', hexToRgbString(primaryColor));
      root.style.setProperty('--site-secondary-rgb', hexToRgbString(secondaryColor));
      
      // Admin-specific RGB variables
      root.style.setProperty('--admin-primary-rgb', hexToRgbString(primaryColor));
      root.style.setProperty('--admin-secondary-rgb', hexToRgbString(secondaryColor));
      
      logger.debug('Applied RGB theme variables');
    } catch (rgbError) {
      logger.error('Error setting RGB colors', { details: safeDetails(rgbError) });
      // Fallback to direct values
      root.style.setProperty('--color-primary', '0, 240, 255');
      root.style.setProperty('--color-secondary', '255, 45, 110');
      root.style.setProperty('--color-accent', '139, 92, 246');
    }
    
    // Set Hex variables for direct color values
    try {
      // Hex variables (used for direct color values)
      root.style.setProperty('--color-primary-hex', primaryColor);
      root.style.setProperty('--color-secondary-hex', secondaryColor);
      root.style.setProperty('--color-accent-hex', accentColor);
      root.style.setProperty('--color-background-hex', bgColor);
      root.style.setProperty('--color-foreground-hex', textColor);
      
      // Legacy system variable names for backward compatibility
      root.style.setProperty('--site-effect-color', primaryColor);
      root.style.setProperty('--site-effect-secondary', secondaryColor);
      root.style.setProperty('--site-effect-tertiary', accentColor);
      root.style.setProperty('--impulse-primary-hex', primaryColor);
      root.style.setProperty('--impulse-secondary-hex', secondaryColor);
      
      logger.debug('Applied hex theme variables');
    } catch (hexError) {
      logger.error('Error setting hex colors', { details: safeDetails(hexError) });
    }
    
    // Set animation timing variables
    const transitionFast = ensureStringValue(getThemeProperty(theme, 'animation.duration.fast', '150ms'));
    const transitionNormal = ensureStringValue(getThemeProperty(theme, 'animation.duration.normal', '300ms'));
    const transitionSlow = ensureStringValue(getThemeProperty(theme, 'animation.duration.slow', '500ms'));
    
    root.style.setProperty('--transition-fast', transitionFast);
    root.style.setProperty('--transition-normal', transitionNormal);
    root.style.setProperty('--transition-slow', transitionSlow);
    
    // Apply the same timing variables to all namespaces for consistency
    root.style.setProperty('--impulse-transition-fast', transitionFast);
    root.style.setProperty('--impulse-transition-normal', transitionNormal);
    root.style.setProperty('--impulse-transition-slow', transitionSlow);
    
    root.style.setProperty('--site-transition-fast', transitionFast);
    root.style.setProperty('--site-transition-normal', transitionNormal);
    root.style.setProperty('--site-transition-slow', transitionSlow);
    
    root.style.setProperty('--admin-transition-fast', transitionFast);
    root.style.setProperty('--admin-transition-normal', transitionNormal);
    root.style.setProperty('--admin-transition-slow', transitionSlow);
    
    // Set animation durations
    root.style.setProperty('--animation-fast', '1s');
    root.style.setProperty('--animation-normal', '2s');
    root.style.setProperty('--animation-slow', '3s');
    
    root.style.setProperty('--impulse-animation-fast', '1s');
    root.style.setProperty('--impulse-animation-normal', '2s');
    root.style.setProperty('--impulse-animation-slow', '3s');
    
    root.style.setProperty('--site-animation-fast', '1s');
    root.style.setProperty('--site-animation-normal', '2s');
    root.style.setProperty('--site-animation-slow', '3s');
    
    // Add theme active classes
    root.classList.add('impulse-theme-active');
    root.classList.add('theme-applied');
    
    // Set light/dark mode based on background color - USING STRING VALIDATION
    // safely check if color is a dark color by inspecting the hex value
    const isDark = bgColor.startsWith('#0') || bgColor.startsWith('#1') || bgColor.startsWith('#2');
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    
    // Performance measurement
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    logger.debug('Applied theme to document', { 
      details: { 
        primaryColor, 
        secondaryColor,
        bgColor, 
        isDark,
        duration: `${duration}ms`
      } 
    });
  } catch (error) {
    logger.error('Error applying theme to document', { details: safeDetails(error) });
    applyEmergencyFallback();
  }
}

/**
 * Apply emergency fallback styling in case of critical errors
 */
export function applyEmergencyFallback(): void {
  try {
    logger.warn('Applying emergency fallback styling');
    const root = document.documentElement;
    
    // Emergency fallback colors
    const bgColor = '#12121A';
    const textColor = '#F6F6F7';
    const primaryColor = '#00F0FF';
    const secondaryColor = '#FF2D6E';
    
    // Apply directly to root element for maximum compatibility
    root.style.backgroundColor = bgColor;
    root.style.color = textColor;
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    
    // Apply minimum required variables
    root.style.setProperty('--background', '224 10% 9%');
    root.style.setProperty('--foreground', '220 6% 97%');
    root.style.setProperty('--primary', '183 100% 50%');
    root.style.setProperty('--secondary', '341 100% 59%');
    
    root.style.setProperty('--color-primary', '0, 240, 255');
    root.style.setProperty('--color-secondary', '255, 45, 110');
    
    root.style.setProperty('--impulse-primary', primaryColor);
    root.style.setProperty('--impulse-secondary', secondaryColor);
    
    root.style.setProperty('--site-effect-color', primaryColor);
    root.style.setProperty('--site-effect-secondary', secondaryColor);
    
    // Add fallback class
    root.classList.add('impulse-theme-fallback');
    root.classList.add('dark');
    
    logger.debug('Applied emergency fallback styling');
  } catch (error) {
    logger.error('Critical error in emergency fallback', { details: safeDetails(error) });
  }
}
