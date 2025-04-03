
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getThemeProperty } from './themeUtils';
import { hexToHSL, hexToRgbString } from './colorUtils';

const logger = getLogger('ThemeApplicator', { category: LogCategory.THEME });

/**
 * Apply a theme to the document by setting CSS variables
 */
export function applyThemeToDocument(theme: ImpulseTheme): void {
  try {
    if (!theme || typeof theme !== 'object') {
      logger.warn('Invalid theme object provided to applyThemeToDocument');
      return;
    }
    
    const root = document.documentElement;
    
    // Apply background and text colors
    const bgColor = getThemeProperty(theme, 'colors.background.main', '#12121A');
    const textColor = getThemeProperty(theme, 'colors.text.primary', '#F6F6F7');
    const primaryColor = getThemeProperty(theme, 'colors.primary', '#00F0FF');
    const secondaryColor = getThemeProperty(theme, 'colors.secondary', '#FF2D6E');
    
    try {
      // Set Tailwind CSS variables
      root.style.setProperty('--background', hexToHSL(bgColor));
      root.style.setProperty('--foreground', hexToHSL(textColor));
      root.style.setProperty('--primary', hexToHSL(primaryColor));
      root.style.setProperty('--primary-foreground', hexToHSL('#FFFFFF'));
      root.style.setProperty('--secondary', hexToHSL(secondaryColor));
      root.style.setProperty('--secondary-foreground', hexToHSL('#FFFFFF'));
    } catch (hslError) {
      logger.error('Error setting HSL colors', { details: safeDetails(hslError) });
      // Fallback to direct hex
      root.style.setProperty('--background', '224 10% 9%'); // #12121A
      root.style.setProperty('--foreground', '220 6% 97%'); // #F6F6F7
      root.style.setProperty('--primary', '183 100% 50%'); // #00F0FF
      root.style.setProperty('--primary-foreground', '0 0% 100%'); // #FFFFFF
      root.style.setProperty('--secondary', '341 100% 59%'); // #FF2D6E
      root.style.setProperty('--secondary-foreground', '0 0% 100%'); // #FFFFFF
    }
    
    // Set RGB variables
    try {
      root.style.setProperty('--color-primary', hexToRgbString(primaryColor));
      root.style.setProperty('--color-secondary', hexToRgbString(secondaryColor));
    } catch (rgbError) {
      logger.error('Error setting RGB colors', { details: safeDetails(rgbError) });
      // Fallback to direct values
      root.style.setProperty('--color-primary', '0, 240, 255');
      root.style.setProperty('--color-secondary', '255, 45, 110');
    }
    
    // Set effect colors
    root.style.setProperty('--site-effect-color', primaryColor);
    root.style.setProperty('--site-effect-secondary', secondaryColor);
    root.style.setProperty('--impulse-primary', primaryColor);
    root.style.setProperty('--impulse-secondary', secondaryColor);
    
    // Set timing variables 
    const transitionFast = getThemeProperty(theme, 'animation.duration.fast', '150ms');
    const transitionNormal = getThemeProperty(theme, 'animation.duration.normal', '300ms');
    const transitionSlow = getThemeProperty(theme, 'animation.duration.slow', '500ms');
    
    root.style.setProperty('--transition-fast', transitionFast);
    root.style.setProperty('--transition-normal', transitionNormal);
    root.style.setProperty('--transition-slow', transitionSlow);
    
    // Set animation durations
    root.style.setProperty('--animation-fast', '1s');
    root.style.setProperty('--animation-normal', '2s');
    root.style.setProperty('--animation-slow', '3s');
    
    // Add theme active class
    root.classList.add('impulse-theme-active');
    
    // Set light/dark mode
    const isDark = bgColor.startsWith('#0') || bgColor.startsWith('#1') || bgColor.startsWith('#2');
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    logger.debug('Applied theme to document', { 
      details: { 
        primaryColor, 
        bgColor, 
        isDark 
      } 
    });
  } catch (error) {
    logger.error('Error applying theme to document', { details: safeDetails(error) });
  }
}
